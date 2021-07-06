import { EntityRegistry } from '../entities/EntityRegistry';
import {
  AmbientLight,
  AxesHelper,
  Camera,
  Color,
  CylinderGeometry, IUniform,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial, NormalBlending,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera, PlaneBufferGeometry,
  PlaneGeometry,
  PointLight,
  RepeatWrapping,
  Scene, Shader,
  ShaderMaterial,
  SphereGeometry,
  TextureLoader, Vector2,
  Vector3, WebGLRenderer,
  WebGLRenderer as Renderer
} from 'three';
import { assetsManager, Model } from '../services/AssetsManager';
import { EntityBuilder } from '../entities/EntityBuilder';
import { Entity } from '../entities/Entity';
import { BoundariesComponent, BoundingCircle, positionAbsolute } from '../components/BoundariesComponent';
import { PositionComponent } from '../components/PositionComponent';
import { System } from './System';
import { length, normalize, Point2D } from '@shared/types/Point2D';
import { RotationComponent } from '../components/RotationComponent';
import { AccelerationComponent } from '../components/AccelerationComponent';
import { JumpComponent } from '../components/JumpComponent';
import spaceImg from '/public/assets/images/space_classic.jpg';
import { ComponentsRegistry } from '../components/Components';

import explosionFragmentShader from '../shaders/explosion.fragment.glsl';
import defaultVertexShader from '../shaders/vertex.glsl';


type RendererEntity = Entity & { model: Model, position: PositionComponent };
const CAMERA_HEIGHT = 600;
const UP_JUMP = 100;
const DOWN_JUMP = -100;
const CAMERA_FOV = 50;

class EntityId {
}

/***
 * Renders entities with model
 */
export class WebGL3DRendererSystem implements System {
  private scene: Scene;
  private renderer: WebGLRenderer;
  // private camera: PerspectiveCamera;
  private camera: Camera;
  // private controls: OrbitControls;
  private models: Object3D;
  private pointLight: PointLight;
  private isBondariesVisible = false;
  private isAccelerationVisible = false;
  private isAxesVisible = false;
  private dynamicCamera = false;
  private aspect = 1;
  private width: number;
  private height: number;
  private explosionShaderMaterial: ShaderMaterial;
  private longLivingObjects: Object3D;
  private longLivingObjectsMapping = new Map<EntityId, Mesh>();


  constructor(private canvas: HTMLCanvasElement) {
    this.initFlags();
    this.scene = new Scene();
    this.models = new Object3D();
    this.scene.add(this.models);
    this.longLivingObjects = new Object3D();
    this.scene.add(this.longLivingObjects);

    this.renderer = new WebGLRenderer({ canvas });
    (this.renderer as any).antialias = true;
    this.renderer.setClearColor(new Color('#071015'))
    const pixelRation = window.devicePixelRatio;
    this.renderer.setPixelRatio(pixelRation)

    this.width = canvas.width;
    this.height = canvas.height;
    this.aspect = this.width / this.height;
    this.camera = this.createPerspectiveCamera();
    // this.camera = this.createOrthoCamera();

    this.camera.position.set(0, 0, CAMERA_HEIGHT);
    this.camera.rotation.x = Math.PI;

    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    if (this.isAxesVisible) {
      const axes = new AxesHelper();
      axes.scale.multiplyScalar(1000);
      this.scene.add(axes);
    }

    this.explosionShaderMaterial = this.createExplosionShader();

    this.pointLight = new PointLight(new Color('#ffffff'));
    const ambient = new AmbientLight();
    this.scene.add(ambient);
    this.scene.add(this.pointLight);
  }

  init(registry: EntityRegistry) {
    const map = registry.findSingle(['map']).map;
    new TextureLoader().load(spaceImg, (texture) => {
      const plane = new PlaneBufferGeometry(map.width, map.height, 2, 2);
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping
      texture.repeat.set(map.width / texture.image.width, map.height / texture.image.height);
      const material = new MeshBasicMaterial({
        map: texture
      });
      const background = new Mesh(plane, material);
      background.position.set(map.width / 2, map.height / 2, -200);
      this.scene.add(background)
    })
  }

  update(registry: EntityRegistry): void {

    this.models.remove(...this.models.children);
    const models = registry.findEntitiesByComponents(['model', 'position']);
    models.forEach(model => {
      const builder = EntityBuilder.fromEntity(model);
      const jump = builder.getOrDefault('jump', false);
      this.renderEntity(model, {
        acceleration: builder.getOrDefault('acceleration', null),
        rotation: builder.getOrDefault('rotation', 0),
        boundaries: builder.getOrDefault('boundaries', []),
        jump
      });
      //TODO: Put in separate system
      builder.removeComponent('jump');
    });

    const explosionsEntities = registry.findEntitiesByComponents(['explosion']);
    const dt = registry.findSingle(['time']).time.dt;
    this.renderExplosionEntities(explosionsEntities, dt);

    const cameraAt = registry.findEntitiesByComponents(['cameraAt', 'position']);
    if (cameraAt.length > 0) {
      this.updateCameraPosition(cameraAt[0].position);
    }
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    console.log('WEBGL displosed');
    this.scene.traverse((object) => {
      if (object instanceof Mesh) {
        if (object.material) {
          object.material.dispose();
        }
        object.geometry.dispose();
      }
    })
    this.scene.remove(...this.scene.children);
    this.renderer.renderLists.dispose();
    this.renderer.dispose();
  }

  private renderEntity(entity: RendererEntity, options: {
    rotation: RotationComponent,
    boundaries: BoundariesComponent,
    acceleration: AccelerationComponent | null,
    jump: JumpComponent | false
  }) {
    const { model, position } = entity;
    const object = assetsManager.getModel(model);

    object.position.setX(position.x);
    object.position.setY(position.y)
    if (options.jump === false) {
      object.position.setZ(0);
    } else {
      object.position.setZ(options.jump === JumpComponent.Up ? UP_JUMP : DOWN_JUMP);
    }

    if (this.isBondariesVisible) {
      const circles = positionAbsolute(options.boundaries, entity.position, options.rotation)
      this.renderBoundaries(circles);
    }
    object.rotation.set(0, 0, options.rotation);

    if (this.isAccelerationVisible) {
      if (options.acceleration) {
        this.renderAcceleration(position, options.acceleration);
      }
    }
    this.models.add(object);
  }

  private initFlags() {
    const params = new URLSearchParams(window.location.search);
    this.isBondariesVisible = params.get('boundaries') !== null;
    this.isAccelerationVisible = params.get('acceleration') !== null;
    this.isAxesVisible = params.get('axes') !== null;
    this.dynamicCamera = params.get('dynamic_camera') !== null;
  }

  private renderBoundaries(circles: BoundingCircle[]) {
    for (const circle of circles) {
      const geometry = new SphereGeometry(circle.radius);
      const mesh = new LineSegments(geometry, new LineBasicMaterial({
        color: 'red'
      }));
      mesh.position.setX(circle.position.x);
      mesh.position.setY(circle.position.y);
      this.models.add(mesh);
    }
  }

  private renderAcceleration(position: Point2D, acceleration: Point2D) {
    const height = length(acceleration) * 10;
    const angle = Math.acos(normalize(acceleration).x) + Math.PI / 2;
    const geometry = new CylinderGeometry(5, 5, height, 32);
    const material = new MeshBasicMaterial({ color: 0xffff00 });
    const cylinder = new Mesh(geometry, material);
    cylinder.position.setX(position.x);
    cylinder.position.setY(position.y);
    cylinder.rotation.set(0, 0, angle);
    const obj = new Object3D();
    // obj.position.y += height / 2;
    obj.add(cylinder)
    this.models.add(obj);
  }

  private updateCameraPosition(position: PositionComponent) {
    const h = Math.tan(CAMERA_FOV * Math.PI / 360) * this.camera.position.z;
    const w = this.aspect * h;

    const lookAtPosition = new Vector3(position.x, position.y, 0);
    const cameraPosition = new Vector3().copy(lookAtPosition);
    // this.camera.lookAt(cameraPosition)
    // this.camera.position.set(lookAtPosition.x, lookAtPosition.y, this.camera.position.z);
    // const pointLightPosition = new Vector3().copy(this.camera.position);
    // pointLightPosition.add(cameraPosition).multiplyScalar(0.4);
    // this.pointLight.position.copy(pointLightPosition);

    this.camera.lookAt(cameraPosition)
    this.camera.position.set(cameraPosition.x, cameraPosition.y, this.camera.position.z);
    const pointLightPosition = new Vector3().copy(this.camera.position);
    pointLightPosition.add(cameraPosition).multiplyScalar(0.4);
    this.pointLight.position.copy(pointLightPosition);
  }

  private createPerspectiveCamera() {
    const camera = new PerspectiveCamera(CAMERA_FOV, this.width / this.height);
    camera.near = 0;
    camera.far = CAMERA_HEIGHT;
    return camera;
  }

  private createOrthoCamera() {
    return new OrthographicCamera(this.width / -2, this.width / 2, this.height / 2, this.height / -2, 0, CAMERA_HEIGHT)
  }

  updateSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.aspect = width / height;
    if (this.camera instanceof PerspectiveCamera) {
      this.camera = this.createPerspectiveCamera();
      this.camera.position.set(0, 0, CAMERA_HEIGHT);
      this.camera.rotation.x = Math.PI;
      // this.camera.aspect = this.aspect;
      // this.camera.updateProjectionMatrix();
    }
    //
    this.renderer.setSize(width, height);
  }

  private renderExplosionEntities(entities: (Entity & Pick<ComponentsRegistry, 'explosion'>)[], dt: number) {
    for (const entity of entities) {
      let mesh = this.longLivingObjectsMapping.get(entity.id);
      if (!mesh) {
        const position = entity.explosion.position;
        const size = entity.explosion.size;
        const geometry = new PlaneBufferGeometry(size, size, 1, 1);
        const material = this.explosionShaderMaterial;
        mesh = new Mesh(geometry, material);
        mesh.position.set(position.x, position.y, 10);
        this.longLivingObjects.add(mesh);
        this.longLivingObjectsMapping.set(entity.id, mesh);
      }
      (mesh.material as ShaderMaterial).uniforms.u_time.value += dt;
    }
  }

  private createExplosionShader(): ShaderMaterial {
    return new ShaderMaterial({
      uniforms: {
        u_time: { type: 'f', value: 1.0 } as IUniform,
        u_resolution: { type: 'v2', value: new Vector2(this.width, this.height) } as IUniform,
      },
      fragmentShader: explosionFragmentShader,
      vertexShader: defaultVertexShader,
      blending: NormalBlending,
      transparent: true
    });
  }
}
