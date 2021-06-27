import { CylinderGeometry, Group, LoadingManager, Mesh, MeshStandardMaterial, Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export type Model = keyof AssetsManager['models'];

interface InternalModel {
  mesh: Object3D;

  create(): Object3D;
}

interface ExternalModel {
  url: string;
  mesh: Object3D;

  postProcess(scene: Group): Object3D;
}

export class AssetsManager {
  private models = {
    'starship': {
      kind: 'external',
      url: 'assets/models/starship/scene.gltf',
      mesh: new Object3D(),
      postProcess: (scene: Group) => {
        let result: Object3D = scene;
        const wrapper = new Object3D();
        result.position.set(0, 0, 0);
        result.rotation.x = Math.PI / 2
        result.rotation.y = 0
        result.rotation.z = 0;
        result.traverse(o => {
          if (o instanceof Mesh) {
            o.receiveShadow = true;
            o.castShadow = true;
          }
        })
        result.scale.multiplyScalar(2)
        wrapper.add(result);
        return wrapper;
      }
    },
    'spaceship': {
      kind: 'external',
      url: 'assets/models/spaceship/scene.gltf',
      mesh: new Object3D(),
      postProcess: (scene: Group) => {
        let result: Object3D = scene;
        const wrapper = new Object3D();
        result.position.set(0, 0, 0);
        result.rotation.x = -Math.PI;
        result.rotation.z = Math.PI;
        result.rotation.y = Math.PI;
        result.scale.multiplyScalar(10)
        wrapper.add(result);
        return wrapper;
      }
    },
    'spaceships': {
      kind: 'external',
      url: 'assets/models/spaceships/scene.gltf',
      mesh: new Object3D(),
      postProcess: (scene: Group) => {
        let result: Object3D = scene;
        scene.traverse(node => {
          //space_shi_, sapceship_3, drt, df
          if (node.name.match(/space_shi_/)) {
            result = node;
          }
        })
        const wrapper = new Object3D();
        result.position.set(0, 0, 0);
        result.rotation.x = -Math.PI;
        result.rotation.z = Math.PI;
        result.rotation.y = Math.PI;
        result.scale.multiplyScalar(0.3);
        wrapper.add(result);
        return wrapper;
      }
    },
    'planet': {
      kind: 'external',
      url: 'assets/models/planet/scene.gltf',
      mesh: new Object3D(),
      postProcess: (scene: Group) => {
        let result: Object3D = scene;
        const wrapper = new Object3D();
        result.position.set(0, 0, 0);
        result.rotation.x = -Math.PI;
        result.rotation.z = Math.PI;
        result.rotation.y = Math.PI;
        result.traverse(o => {
          if (o instanceof Mesh) {
            o.receiveShadow = true;
            o.castShadow = true;
          }
        })
        wrapper.add(result);
        return wrapper;
      }
    },
    'kepler': {
      kind: 'external',
      url: 'assets/models/kepler/scene.gltf',
      mesh: new Object3D(),
      postProcess: (scene: Group) => {
        let result: Object3D = scene;
        const wrapper = new Object3D();
        result.position.set(0, 0, 0);
        result.rotation.x = -Math.PI;
        result.rotation.z = Math.PI;
        result.rotation.y = Math.PI;
        result.scale.multiplyScalar(0.03);
        wrapper.add(result);
        return wrapper;
      }
    },
    'asteroid': {
      kind: 'external',
      url: 'assets/models/asteroid/scene.gltf',
      mesh: new Object3D(),
      postProcess: (scene: Group) => {
        let result: Object3D = scene;
        const wrapper = new Object3D();
        result.position.set(0, 0, 0);
        result.rotation.x = -Math.PI;
        result.rotation.z = Math.PI;
        result.rotation.y = Math.PI;
        result.scale.multiplyScalar(0.3);
        wrapper.add(result);
        return wrapper;
      }
    },
    'laser': {
      kind: 'internal',
      mesh: new Object3D(),
      create: () => {
        const radius = 3;
        const height = 20;
        const geometry = new CylinderGeometry(radius, radius, height);
        const mesh = new Mesh(geometry, new MeshStandardMaterial({
          color: 'red'
        }))
        return mesh;
      }
    }
  } as const;

  getModel(model: Model): Object3D {
    return this.models[model].mesh.clone(true);
  }

  private manager: LoadingManager;
  private loader: GLTFLoader;

  constructor() {
    this.manager = new LoadingManager();
    this.loader = new GLTFLoader(this.manager);
  }

  async load() {
    await this.loadModels();
  }

  private async loadModels() {
    for (const [name, config] of Object.entries(this.models)) {
      if (config.kind === 'external') {
        this.loader.load(config.url, (gltf) => {
          (config as any).mesh = config.postProcess(gltf.scene);
        })
      } else {
        (config as any).mesh = config.create();
      }
    }
  }
}

export const assetsManager = new AssetsManager();
