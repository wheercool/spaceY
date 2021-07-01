import { action, runInAction } from 'mobx';
import { CylinderGeometry, Group, ImageLoader, LoadingManager, Mesh, MeshStandardMaterial, Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export type Model = keyof AssetsManager['models'];


export class AssetsManager {
  private imagesToPrefetch = [
    'dock_screen.jpg',
    'station.jpg',
    'quest_screen.jpg',
    'rabbit.png',
    'storm.png',
    'valkiria.png',
    'energy_shield.png',
    'gravity_gun.png',
    'gravity_gun_small.png',
    'rocket.png',
    'turret.png',
    'supernova_hires.jpg',
    'crystal.png'
  ]
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
    'valkiria': {
      kind: 'external',
      url: 'assets/models/valkiria/valkiria.glb',
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
        result.scale.multiplyScalar(0.8)
        wrapper.add(result);
        return wrapper;
      }
    },
    'rabbit': {
      kind: 'external',
      url: 'assets/models/rabbit/rabbit.glb',
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
        result.scale.multiplyScalar(0.8)
        wrapper.add(result);
        return wrapper;
      }
    },
    'storm': {
      kind: 'external',
      url: 'assets/models/spaceship/scene.gltf',
      mesh: new Object3D(),
      postProcess: (scene: Group) => {
        let result: Object3D = scene;
        const wrapper = new Object3D();
        result.position.set(0, 0, 0);
        result.rotation.x = Math.PI / 2;
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
    'earth': {
      kind: 'external',
      url: 'assets/models/earth/scene.gltf',
      mesh: new Object3D(),
      postProcess: (scene: Group) => {
        let result: Object3D = scene;
        const wrapper = new Object3D();
        result.position.set(0, 0, 0);
        result.rotation.x = -Math.PI;
        result.rotation.z = Math.PI;
        result.rotation.y = Math.PI;
        result.scale.multiplyScalar(0.1);
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
    'supernova': {
      kind: 'external',
      url: 'assets/models/supernova/supernova.glb',
      mesh: new Object3D(),
      postProcess: (scene: Group) => {
        let result: Object3D = scene;
        const wrapper = new Object3D();
        result.scale.multiplyScalar(100);
        wrapper.add(result);
        return wrapper;
      }
    },
    'crystal': {
      kind: 'external',
      url: 'assets/models/crystal/crystal.glb',
      mesh: new Object3D(),
      postProcess: (scene: Group) => {
        let result: Object3D = scene;
        const wrapper = new Object3D();
        result.scale.multiplyScalar(0.1);
        wrapper.add(result);
        return wrapper;
      }
    },
    // 'earth': {
    //   kind: 'external',
    //   url: 'assets/models/earth/earth.glb',
    //   mesh: new Object3D(),
    //   postProcess: (scene: Group) => {
    //     let result: Object3D = scene;
    //     const wrapper = new Object3D();
    //     result.scale.multiplyScalar(100);
    //     wrapper.add(result);
    //     return wrapper;
    //   }
    // },
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
  private progressHandler: (progress: number) => void = noop;
  private doneHandler: () => void = noop;

  getModel(model: Model): Object3D {
    return this.models[model].mesh.clone(true);
  }

  private manager: LoadingManager;

  private loader: GLTFLoader;

  constructor() {
    this.manager = new LoadingManager();

    this.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      runInAction(() => this.progressHandler(Math.round(itemsLoaded / itemsTotal * 100)));
    };

    this.manager.onLoad = () => {
      runInAction(() => this.doneHandler());
    };

    this.loader = new GLTFLoader(this.manager);
  }

  async load(progress: (progress: number) => void, doneHandler: () => void) {
    this.progressHandler = progress;
    this.doneHandler = doneHandler;
    await this.loadModels();
    this.loadImages();
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

  private loadImages() {
    const imageLoader = new ImageLoader(this.manager);
    this.imagesToPrefetch.forEach(img => imageLoader.load(`assets/images/${img}`));
  }
}

export const assetsManager = new AssetsManager();

function noop() {
}
