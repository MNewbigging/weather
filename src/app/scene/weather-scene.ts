import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { ModelLoader } from './model-loader';
import { Renderer } from './renderer';

export class WeatherScene {
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private renderer: Renderer;
  private orbitControls: OrbitControls;

  constructor(canvas: HTMLCanvasElement, private loader: ModelLoader) {
    this.scene.background = new THREE.Color('#1680AF');

    this.camera = new THREE.PerspectiveCamera();

    this.renderer = new Renderer(canvas, this.camera, this.scene);

    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.renderer.domElement
    );
    this.orbitControls.enableDamping = true;

    this.setupScene();
  }

  start() {
    this.update();
  }

  private setupScene() {
    const objects = this.loader.get('scene');
    this.scene.add(objects);
  }

  private update = () => {
    requestAnimationFrame(this.update);

    this.orbitControls.update();

    this.renderer.render();
  };
}
