import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class ModelLoader {
  loading = false;
  readonly models = new Map<string, THREE.Object3D>();

  private loadingManager = new THREE.LoadingManager();

  get(modelName: string): THREE.Object3D {
    // Clone the model
    const clone = this.models.get(modelName)?.clone();

    // If we couldn't find the model, return an 'error' object
    if (!clone) {
      const geom = new THREE.SphereGeometry();
      const mat = new THREE.MeshBasicMaterial({ color: 'red' });
      const mesh = new THREE.Mesh(geom, mat);

      return mesh;
    }

    // Clear its position
    clone.position.set(0, 0, 0);

    return clone;
  }

  load(onLoad: () => void) {
    // Setup loading manager
    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      console.log(
        `Loading model: ${url}. \n Loaded ${itemsLoaded} of ${itemsTotal}.`
      );
    };

    this.loadingManager.onLoad = () => {
      this.loading = false;
      onLoad();
    };

    // Start loading
    this.loading = true;

    // If you need a texture atlas for the models, load it here first
    // remember to set texture.encoding = THREE.sRGBEncoding;
    // Then pass it to load models and on each model,
    // traverse each loaded model and assign material.map to atlas to each mesh child node

    this.loadModels();
  }

  private loadModels() {
    const gltfLoader = new GLTFLoader(this.loadingManager);

    // Might need to do this for the build...
    //const sceneUrl = new URL('assets/weather.glb', import.meta.url).href;
    gltfLoader.load('assets/weather.glb', (gltf) => {
      // Traverse the gltf scene
      gltf.scene.traverse((child) => {
        const node = child as THREE.Mesh;
        if (node.isMesh) {
          // Kenney assets need their metalness reducing to render correctly
          const mat = node.material as THREE.MeshStandardMaterial;
          mat.metalness = 0;
        }
      });

      this.models.set('scene', gltf.scene);
    });
  }
}
