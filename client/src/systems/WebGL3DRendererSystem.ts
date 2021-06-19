import { EntityRegistry } from '../entities/EntityRegistry';
import {
  AmbientLight,
  AxesHelper,
  Color,
  LineBasicMaterial,
  LineSegments,
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

type RendererEntity = Entity & { model: Model, position: PositionComponent };

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

  constructor(private canvas: HTMLCanvasElement) {
    this.initFlags();
    this.scene = new Scene();
    this.models = new Object3D();
    this.scene.add(this.models);

    this.renderer = new Renderer({ canvas });
    (this.renderer as any).antialias = true;
    this.renderer.setClearColor(new Color('#071015'))

    this.camera = new PerspectiveCamera(50, canvas.width / canvas.height);
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

  private renderShape(shape: RendererEntity) {
    const { model, position } = shape;

    const object = assetsManager.getModel(model);
    object.position.setX(position.x);
    object.position.setY(position.y)
    const rotation = EntityBuilder.fromEntity(shape)
      .getOrDefault('rotation', 0);

    const boundaries = EntityBuilder.fromEntity(shape)
      .getOrDefault('boundaries', []);

    if (boundaries.length && this.isBondariesVisible) {
      const circles = positionAbsolute(boundaries, shape.position, rotation)
      this.renderBoundaries(circles);
    }
    object.rotation.set(0, 0, rotation);

    this.models.add(object);
  }

  private initFlags() {
    const params = new URLSearchParams(window.location.search);
    this.isBondariesVisible = params.get('boundaries') !== null;
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
}
