import { runInAction } from 'mobx';
import { CylinderGeometry, Group, ImageLoader, LoadingManager, Mesh, MeshStandardMaterial, Object3D, Texture, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RenderQuality, Settings } from '../Settings';

export type Model = keyof AssetsManager['models'];
export type TextureName = keyof AssetsManager['textures'];

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
    'crystal.png',
    'space_classic.jpg'
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
            if (Settings.renderingQuality === RenderQuality.High) {
              o.receiveShadow = true;
              o.castShadow = true;
            }
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
            if (Settings.renderingQuality === RenderQuality.High) {
              o.receiveShadow = true;
              o.castShadow = true;
            }
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
            if (Settings.renderingQuality === RenderQuality.High) {
              o.receiveShadow = true;
              o.castShadow = true;
            }
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
        let mesh: Mesh;
        result.traverse(o => {
          if (o instanceof Mesh) {
            mesh = o;
            if (Settings.renderingQuality === RenderQuality.High) {
              o.receiveShadow = true;
              o.castShadow = true;
            }
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
      url: 'assets/models/asteroid/asteroid2.glb',
      mesh: new Object3D(),
      postProcess: (scene: Group) => {
        let result: Object3D = scene;
        const wrapper = new Object3D();
        result.position.set(0, 0, 0);
        result.rotation.x = -Math.PI;
        result.rotation.z = Math.PI;
        result.rotation.y = Math.PI;
        result.scale.multiplyScalar(0.3);
        let mesh: Mesh;
        scene.traverse(o => {
          if (o instanceof Mesh) {
            mesh = o;
          }
        });
        wrapper.add(result);
        return mesh!;
      },
      update: (mesh: Mesh) => {
        mesh.position.set(0, 0, 0);
        mesh.rotation.x = -Math.PI;
        mesh.rotation.z = Math.PI;
        mesh.rotation.y = Math.PI;
        mesh.scale.multiplyScalar(0.3);
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
    },
    'target': {
      kind: 'internal',
      mesh: new Object3D(),
      create: () => {
        const radius = 200;
        const height = 1;
        const geometry = new CylinderGeometry(radius, radius, height, 20);
        const mesh = new Mesh(geometry, new MeshStandardMaterial({
          color: '#53cd50',
          metalness: 0.8,
          emissive: '#50cdba',
          roughness: 0.7
        }));
        const wrapper = new Object3D();
        wrapper.add(mesh)
        mesh.rotation.set(Math.PI / 2, 0, 0);
        return wrapper;
      }
    }
  } as const;
  private textures = {
    'space': {
      url: 'space_classic.jpg',
      texture: new Texture()
    },
    'noise': {
      url: 'noise.png',
      texture: new Texture()
    },
    'noise2': {
      url: 'noise.png',
      texture: new Texture()
    }
  }

  getModel(model: Model): Object3D {
    if (model === 'asteroid') {
      const mesh = this.models[model].mesh.clone();
      this.models.asteroid.update(mesh as Mesh);
      return mesh;
    }
    return this.models[model].mesh.clone();
  }
  constructor() {
  }

  load(manager: LoadingManager) {
    this.loadModels(manager);
    this.loadImages(manager);
    this.loadTextures(manager);
  }

  private async loadModels(manager: LoadingManager) {
    const loader = new GLTFLoader(manager);
    for (const [name, config] of Object.entries(this.models)) {
      if (config.kind === 'external') {
        loader.load(config.url, (gltf) => {
          (config as any).mesh = config.postProcess(gltf.scene);
        })
      } else {
        (config as any).mesh = config.create();
      }
    }
  }

  private loadImages(manager: LoadingManager) {
    const imageLoader = new ImageLoader(manager);
    this.imagesToPrefetch.forEach(img => imageLoader.load(`assets/images/${img}`));
  }

  getTexture(textureName: TextureName): Texture {
    return this.textures[textureName].texture;
  }

  private loadTextures(manager: LoadingManager) {
    const textureLoader = new TextureLoader(manager)
    for (const config of Object.values(this.textures)) {
      textureLoader.load(`assets/images/${config.url}`, (texture) => {
        config.texture = texture;
      })
    }
  }
}

export const assetsManager = new AssetsManager();

function noop() {
}
