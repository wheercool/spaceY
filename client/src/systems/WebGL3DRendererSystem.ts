import { EntityRegistry } from '../entities/EntityRegistry';
import {
  AmbientLight,
  AxesHelper, Camera,
  Color,
  CylinderGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  Vector3,
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

type RendererEntity = Entity & { model: Model, position: PositionComponent };
const CAMERA_HEIGHT = 600;
const UP_JUMP = 100;
const DOWN_JUMP = -100;
const CAMERA_FOV = 50;

/***
 * Renders entities with model
 */
export class WebGL3DRendererSystem implements System {
  private scene: Scene;
  private renderer: Renderer;
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

  constructor(private canvas: HTMLCanvasElement) {
    this.initFlags();
    this.scene = new Scene();
    this.models = new Object3D();
    this.scene.add(this.models);

    this.renderer = new Renderer({ canvas });
    (this.renderer as any).antialias = true;
    this.renderer.setClearColor(new Color('#071015'))

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

    this.pointLight = new PointLight(new Color('#ffffff'));
    const ambient = new AmbientLight();
    this.scene.add(ambient);
    this.scene.add(this.pointLight);
  }

  init(registry: EntityRegistry) {
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

    const cameraAt = registry.findEntitiesByComponents(['cameraAt', 'position']);
    if (cameraAt.length > 0) {
      this.updateCameraPosition(cameraAt[0].position);
    }
    this.renderer.render(this.scene, this.camera);
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
}
