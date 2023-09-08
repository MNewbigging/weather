import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { ModelLoader } from './model-loader';
import { Renderer } from './renderer';

export class WeatherScene {
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private renderer: Renderer;
  private orbitControls?: OrbitControls;

  constructor(canvas: HTMLCanvasElement, private loader: ModelLoader) {
    this.scene.background = new THREE.Color('#1680AF');

    this.camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      1,
      100
    );
    this.camera.position.set(0, 2, 10);

    this.renderer = new Renderer(canvas, this.camera, this.scene);

    // this.orbitControls = new OrbitControls(this.camera, canvas);
    // this.orbitControls.enableDamping = true;

    this.setupScene();
  }

  start() {
    this.update();
  }

  private setupScene() {
    // Objects
    const objects = this.loader.get('scene');
    this.scene.add(objects);

    // Lighting
    const ambientLight = new THREE.AmbientLight();
    this.scene.add(ambientLight);

    const directLight = new THREE.DirectionalLight();
    directLight.position.set(0, 1, 1);
    this.scene.add(directLight);
  }

  private update = () => {
    requestAnimationFrame(this.update);

    //this.orbitControls.update();

    this.renderer.render();
  };
}
