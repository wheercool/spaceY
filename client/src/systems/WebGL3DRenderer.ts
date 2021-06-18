import { EntityRegistry } from '../entities/EntityRegistry';
import {
  AmbientLight,
  AxesHelper,
  Camera,
  Color,
  Object3D,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector3,
  WebGLRenderer as Renderer
} from 'three';
import { Point2D } from '@shared/types/GameState';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { assetsManager, Model } from '../services/AssetsManager';
import { System } from './System';
import { EntityBuilder } from '../entities/EntityBuilder';
import { Entity } from '../entities/Entity';

export class WebGL3DRenderer implements System {
  private scene: Scene;
  private renderer: Renderer;
  private camera: PerspectiveCamera;
  private controls: OrbitControls;
  private models: Object3D;
  private pointLight: PointLight;

  constructor(private canvas: HTMLCanvasElement) {
    this.scene = new Scene();
    this.models = new Object3D();
    this.scene.add(this.models);

    this.renderer = new Renderer({ canvas });
    (this.renderer as any).antialias = true;
    this.renderer.setClearColor(new Color('#071015'))

    this.camera = new PerspectiveCamera(50, canvas.width/ canvas.height);
    this.camera.position.set(0, 0, 500);
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
    models.forEach(shape => this.renderShape(shape));

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
    // this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }

  private renderShape(shape: { model: Model, position: Point2D } & Entity) {
    const { model, position } = shape;

    const object = assetsManager.getModel(model);
    object.position.setX(position.x);
    object.position.setY(position.y)
    const rotation = EntityBuilder.fromEntity(shape)
      .getOrDefault('rotation', 0);
    object.rotation.set(0, 0, rotation);

    this.models.add(object);
  }
}
