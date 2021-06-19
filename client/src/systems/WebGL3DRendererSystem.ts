import { EntityRegistry } from '../entities/EntityRegistry';
import {
  AmbientLight,
  AxesHelper,
  Color,
  CylinderGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer as Renderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { assetsManager, Model } from '../services/AssetsManager';
import { EntityBuilder } from '../entities/EntityBuilder';
import { Entity } from '../entities/Entity';
import { BoundingCircle, positionAbsolute } from '../components/BoundariesComponent';
import { PositionComponent } from '../components/PositionComponent';
import { System } from './System';
import { dot, length, normalize, Point2D } from '@shared/types/Point2D';

type RendererEntity = Entity & { model: Model, position: PositionComponent };
const CAMERA_HEIGHT = 600;

/***
 * Renders entities with model
 */
export class WebGL3DRendererSystem implements System {
  private scene: Scene;
  private renderer: Renderer;
  private camera: PerspectiveCamera;
  private controls: OrbitControls;
  private models: Object3D;
  private pointLight: PointLight;
  private isBondariesVisible: boolean = false;
  private isAccelerationVisible: boolean = false;

  constructor(private canvas: HTMLCanvasElement) {
    this.initFlags();
    this.scene = new Scene();
    this.models = new Object3D();
    this.scene.add(this.models);

    this.renderer = new Renderer({ canvas });
    (this.renderer as any).antialias = true;
    this.renderer.setClearColor(new Color('#071015'))

    this.camera = new PerspectiveCamera(50, canvas.width / canvas.height);
    this.camera.position.set(0, 0, CAMERA_HEIGHT);
    this.camera.rotation.x = Math.PI;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    const axes = new AxesHelper();
    axes.scale.multiplyScalar(1000);
    this.pointLight = new PointLight(new Color('#ffffff'));
    const ambient = new AmbientLight();
    this.scene.add(axes);
    this.scene.add(ambient);
    this.scene.add(this.pointLight);
  }

  init(registry: EntityRegistry) {
  }

  update(registry: EntityRegistry): void {
    this.models.remove(...this.models.children);
    const models = registry.findEntitiesByComponents(['model', 'position']);
    models.forEach(shape => this.renderEntity(shape));

    const cameraAt = registry.findEntitiesByComponents(['cameraAt', 'position']);
    if (cameraAt.length > 0) {
      const position = cameraAt[0].position;
      const lookAtPosition = new Vector3(position.x, position.y, 0);
      this.camera.lookAt(lookAtPosition)
      this.camera.position.set(lookAtPosition.x, lookAtPosition.y, this.camera.position.z);
      const pointLightPosition = new Vector3().copy(this.camera.position);
      pointLightPosition.add(lookAtPosition).multiplyScalar(0.5);
      this.pointLight.position.copy(pointLightPosition);
    }
    this.renderer.render(this.scene, this.camera);
  }

  private renderEntity(entity: RendererEntity) {
    const { model, position } = entity;

    const object = assetsManager.getModel(model);
    object.position.setX(position.x);
    object.position.setY(position.y)
    const builder = EntityBuilder.fromEntity(entity);
    const rotation = builder
      .getOrDefault('rotation', 0);


    if (this.isBondariesVisible) {
      const boundaries = builder
        .getOrDefault('boundaries', []);
      const circles = positionAbsolute(boundaries, entity.position, rotation)
      this.renderBoundaries(circles);
    }
    object.rotation.set(0, 0, rotation);

    if (this.isAccelerationVisible) {
      const acceleration = builder.getOrDefault('acceleration', null);
      if (acceleration) {
        this.renderAcceleration(position, acceleration);
      }
    }
    this.models.add(object);
  }

  private initFlags() {
    const params = new URLSearchParams(window.location.search);
    this.isBondariesVisible = params.get('boundaries') !== null;
    this.isAccelerationVisible = params.get('acceleration') !== null;
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
}
