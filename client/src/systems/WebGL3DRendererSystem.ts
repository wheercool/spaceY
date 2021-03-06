import { EntityRegistry } from '../entities/EntityRegistry';
import {
  AmbientLight,
  AxesHelper,
  Camera,
  Color,
  CylinderGeometry,
  IUniform,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  NormalBlending,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneBufferGeometry,
  PointLight,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Uniform,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three';
import { assetsManager, Model } from '../services/AssetsManager';
import { EntityBuilder } from '../entities/EntityBuilder';
import { Entity } from '../entities/Entity';
import { BoundariesComponent, BoundingCircle, positionAbsolute } from '../components/BoundariesComponent';
import { PositionComponent } from '../components/PositionComponent';
import { System } from './System';
import { add, length, normalize, Point2D, rotate } from '@shared/types/Point2D';
import { RotationComponent } from '../components/RotationComponent';
import { AccelerationComponent } from '../components/AccelerationComponent';
import { ComponentsRegistry } from '../components/Components';

import { RenderQuality, Settings } from '../Settings';
import { EffectName } from '../components/EffectsComponent';

import explosionFragmentShader from '../shaders/explosion.fragment.glsl';
import gravityForceFragmentShader from '../shaders/gravity_force.fragment.glsl';
import fireFragmentShader from '../shaders/fire.fragment.glsl';
import defaultVertexShader from '../shaders/vertex.glsl';
import { EffectZIndexManager } from '../services/EffectZIndexManager';


type RendererEntity = Entity & { model: Model, position: PositionComponent };
const CAMERA_HEIGHT = 600;
const CAMERA_FOV = 50;
const MAP_Z_INDEX = -20;

class EntityId {
}

/***
 * Renders entities with model
 */
export class WebGL3DRendererSystem implements System {
  private scene!: Scene;
  private renderer!: WebGLRenderer;
  // private camera: PerspectiveCamera;
  private camera!: Camera;
  // private controls: OrbitControls;
  private models!: Object3D;
  private pointLight!: PointLight;
  private isBondariesVisible = false;
  private isAccelerationVisible = false;
  private isAxesVisible = false;
  private dynamicCamera = true;
  private aspect = 1;
  private width!: number;
  private height!: number;
  private explosionShaderMaterial!: ShaderMaterial;
  private gravityForceShaderMaterial!: ShaderMaterial;
  private fireShaderMaterial!: ShaderMaterial;
  private longLivingObjects!: Object3D;
  private longLivingObjectsMapping = new Map<EntityId, Mesh>();
  private effectObjects!: Object3D;
  private effectsMapping = new Map<number, Mesh>();
  private effectZIndexManager = new EffectZIndexManager();

  constructor(private canvas: HTMLCanvasElement) {
  }

  init(registry: EntityRegistry) {
    this.initFlags();
    this.scene = new Scene();
    this.models = new Object3D();
    this.scene.add(this.models);
    this.longLivingObjects = new Object3D();
    this.scene.add(this.longLivingObjects);

    this.effectObjects = new Object3D();
    this.scene.add(this.effectObjects);

    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      precision: Settings.renderingQuality === RenderQuality.Low ? 'lowp' : 'highp',
      antialias: Settings.renderingQuality !== RenderQuality.Low
    });
    this.renderer.shadowMap.autoUpdate = false;
    (this.renderer as any).antialias = true;
    this.renderer.setClearColor(new Color('#071015'))
    const pixelRation = window.devicePixelRatio;
    this.renderer.setPixelRatio(pixelRation)

    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.aspect = this.width / this.height;
    // this.camera = this.createPerspectiveCamera();
    this.camera = this.createOrthoCamera();

    this.camera.position.set(0, 0, CAMERA_HEIGHT);
    this.camera.rotation.x = Math.PI;

    if (this.isAxesVisible) {
      const axes = new AxesHelper();
      axes.scale.multiplyScalar(1000);
      this.scene.add(axes);
    }

    this.explosionShaderMaterial = this.createExplosionShader();
    this.gravityForceShaderMaterial = this.createGravityForceShader();
    this.fireShaderMaterial = this.createFireShader();

    this.pointLight = new PointLight(new Color('#ffffff'));
    const ambient = new AmbientLight();
    this.scene.add(ambient);
    if (Settings.renderingQuality === RenderQuality.High) {
      this.scene.add(this.pointLight);
    }
    const map = registry.findSingle(['map']).map;
    const spaceTexture = assetsManager.getTexture('space');
    const plane = new PlaneBufferGeometry(map.width, map.height, 2, 2);
    spaceTexture.wrapS = RepeatWrapping;
    spaceTexture.wrapT = RepeatWrapping
    spaceTexture.repeat.set(map.width / spaceTexture.image.width, map.height / spaceTexture.image.height);
    const material = new MeshBasicMaterial({
      map: spaceTexture
    });
    const background = new Mesh(plane, material);
    background.position.set(map.width / 2, map.height / 2, MAP_Z_INDEX);
    (window as any).renderer = this.renderer;
    this.scene.add(background)
  }

  update(registry: EntityRegistry): void {
    this.models.remove(...this.models.children);
    const models = registry.findEntitiesByComponents(['model', 'position']);
    models.forEach(model => {
      const builder = EntityBuilder.fromEntity(model);
      this.renderEntity(model, {
        acceleration: builder.getOrDefault('acceleration', null),
        rotation: builder.getOrDefault('rotation', 0),
        flip: builder.getOrDefault('flip', {x: 0, y: 0}),
        boundaries: builder.getOrDefault('boundaries', []),
        z: builder.getOrDefault('z', { index: 0 }).index
      });
    });

    const dt = registry.findSingle(['time']).time.dt;

    const effects = registry.findEntitiesByComponents(['effects', 'position']);
    this.renderEffects(effects, dt);

    this.removeExpiredLongLivingObjects(registry.entities);
    this.removeExpiredEffects(effects);

    const cameraAt = registry.findEntitiesByComponents(['cameraAt', 'position']);
    if (cameraAt.length > 0) {
      const mapEntity = registry.findSingle(['map']);
      const width = mapEntity.map.width;
      const height = mapEntity.map.height;
      this.updateCameraPosition(cameraAt[0].position, width, height);
    }
    this.renderer.render(this.scene, this.camera);
  }

  updateSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.aspect = width / height;

    if (this.camera instanceof PerspectiveCamera) {
      this.camera = this.createPerspectiveCamera();
    }

    if (this.camera instanceof OrthographicCamera) {
      this.camera = this.createOrthoCamera();
    }

    this.camera.position.set(0, 0, CAMERA_HEIGHT);
    this.camera.rotation.x = Math.PI;
    this.renderer.setSize(width, height);
  }

  dispose() {
    console.log('WEBGL disposed');
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
    z: number,
    flip: Point2D
  }) {
    const { model, position } = entity;
    let object: Mesh | undefined = this.longLivingObjectsMapping.get(entity.id);
    if (!object) {
      object = assetsManager.getModel(model) as Mesh;
      this.longLivingObjectsMapping.set(entity.id, object);
      this.longLivingObjects.add(object);
    }

    object.position.setX(position.x);
    object.position.setY(position.y)
    object.position.setZ(options.z);

    if (this.isBondariesVisible) {
      const circles = positionAbsolute(options.boundaries, entity.position, options.rotation)
      this.renderBoundaries(circles);
    }
    object.rotation.set(object.rotation.x + options.flip.x, object.rotation.y + options.flip.y, options.rotation);

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

  private updateCameraPosition(position: PositionComponent, width: number, height: number) {
    const { width: cameraWidth, height: cameraHeight } = this.getCameraViewportSize();

    const lookAtPosition = new Vector3(position.x, position.y, 0);
    const cameraPosition = new Vector3().copy(lookAtPosition);

    const MIN_Y = 0;
    const MIN_X = 0;
    const MAX_X = width;
    const MAX_Y = height;
    if (this.dynamicCamera) {
      const cameraHalfHeight = 0.5 * cameraHeight;
      if ((cameraPosition.y - cameraHalfHeight) < MIN_Y) {
        cameraPosition.y = MIN_Y + cameraHalfHeight
      }

      if ((cameraPosition.y + cameraHalfHeight) > MAX_Y) {
        cameraPosition.y = MAX_Y - cameraHalfHeight;
      }

      const cameraHalfWidth = 0.5 * cameraWidth;
      if ((cameraPosition.x - cameraHalfWidth) < MIN_X) {
        cameraPosition.x = MIN_X + cameraHalfWidth;
      }
      if ((cameraPosition.x + cameraHalfWidth) > MAX_X) {
        cameraPosition.x = MAX_X - cameraHalfWidth;
      }
    }
    this.moveCameraTo(cameraPosition);
    const pointLightPosition = new Vector3().copy(this.camera.position);
    pointLightPosition.add(cameraPosition).multiplyScalar(0.4);
    this.pointLight.position.copy(pointLightPosition);
  }

  private createPerspectiveCamera() {
    return new PerspectiveCamera(CAMERA_FOV, this.width / this.height, 1, 1.1 * CAMERA_HEIGHT);
  }

  private createOrthoCamera() {
    return new OrthographicCamera(
      this.width / -2,
      this.width / 2,
      this.height / 2,
      this.height / -2,
      0,
      1.5 * CAMERA_HEIGHT)
  }

  private renderEffects(entities: (Entity & Pick<ComponentsRegistry, 'effects' | 'position'>)[], dt: number) {
    for (const entity of entities) {
      for (const effect of entity.effects) {
        const effectId = effect.id;
        const size = effect.size;
        let mesh = this.effectsMapping.get(effectId);
        const rotation = EntityBuilder.fromEntity(entity).getOrDefault('rotation', 0);
        const position = add(entity.position, rotate(effect.relativePosition, rotation));

        if (!mesh) {
          const geometry = new PlaneBufferGeometry(size.x, size.y, 1, 1);
          const material = this.getEffectShaderMaterial(effect.name); //this.gravityForceShaderMaterial.clone();
          material.uniforms.u_time.value = 0;
          mesh = new Mesh(geometry, material);
          this.effectObjects.add(mesh);
          this.effectsMapping.set(effectId, mesh);
        }
        const z = this.effectZIndexManager.getZCoordinate(effect); // 10
        mesh.position.set(position.x, position.y, z);
        mesh.rotation.z = rotation;
        if (mesh.material instanceof ShaderMaterial) {
          mesh.material.uniforms.u_time.value += dt;
          mesh.material.uniforms.u_resolution.value = new Vector2(size.x, size.y);
        }
      }
    }
  }

  private createExplosionShader(): ShaderMaterial {
    return new ShaderMaterial({
      uniforms: {
        u_time: { type: 'f', value: 1.0 } as IUniform,
        u_resolution: { type: 'v2', value: new Vector2(0, 0) } as IUniform,
        noise_texture: new Uniform(assetsManager.getTexture('noise')),
        noise_texture2: new Uniform(assetsManager.getTexture('noise2'))
      },
      fragmentShader: explosionFragmentShader,
      vertexShader: defaultVertexShader,
      blending: NormalBlending,
      transparent: true
    });
  }

  private removeExpiredLongLivingObjects(entities: (Entity)[]) {
    const ids = new Set<EntityId>(entities.map(entity => entity.id));

    for (const [id, mesh] of this.longLivingObjectsMapping) {
      if (!ids.has(id)) {
        mesh.removeFromParent();
      }
    }
  }

  private removeExpiredEffects(entities: (Entity & Pick<ComponentsRegistry, 'effects'>)[]) {
    const ids = new Set<EntityId>(entities.flatMap(entity => entity.effects.flatMap(e => e.id)));

    for (const [id, mesh] of this.effectsMapping) {
      if (!ids.has(id)) {
        mesh.removeFromParent();
      }
    }
  }

  private getCameraViewportSize() {
    if (this.camera instanceof PerspectiveCamera) {
      const h = 2 * Math.tan(CAMERA_FOV * Math.PI / 360) * this.camera.position.z;
      const w = this.aspect * h;
      return {
        width: w,
        height: h
      }
    }
    if (this.camera instanceof OrthographicCamera) {
      return {
        width: this.width,
        height: this.height
      }
    }
    throw new Error('Not supported camera')
  }

  private createGravityForceShader(): ShaderMaterial {
    return new ShaderMaterial({
      uniforms: {
        u_time: { type: 'f', value: 1.0 } as IUniform,
        u_resolution: { type: 'v2', value: new Vector2(0, 0) } as IUniform,
        u_push: { type: 'f', value: 0.0 } as IUniform
      },
      fragmentShader: gravityForceFragmentShader,
      vertexShader: defaultVertexShader,
      blending: NormalBlending,
      transparent: true
    });
  }

  private createFireShader(): ShaderMaterial {
    return new ShaderMaterial({
      uniforms: {
        u_time: { type: 'f', value: 1.0 } as IUniform,
        u_resolution: { type: 'v2', value: new Vector2(0, 0) } as IUniform
      },
      fragmentShader: fireFragmentShader,
      vertexShader: defaultVertexShader,
      blending: NormalBlending,
      transparent: true
    });
  }

  private getEffectShaderMaterial(name: EffectName): ShaderMaterial {
    switch (name) {
      case EffectName.Explosion:
        return this.explosionShaderMaterial.clone();
      case EffectName.Fire:
        return this.fireShaderMaterial.clone();
      case EffectName.GravityWavePull: {
        const material = this.gravityForceShaderMaterial.clone();
        material.uniforms.u_push.value = 0.0;
        return material;
      }
      case EffectName.GravityWavePush: {
        const material = this.gravityForceShaderMaterial.clone();
        material.uniforms.u_push.value = 1.0;
        return material;
      }
    }
  }

  private moveCameraTo(cameraPosition: Vector3) {
    this.camera.lookAt(cameraPosition)
    this.camera.position.set(cameraPosition.x, cameraPosition.y, this.camera.position.z);
  }
}
