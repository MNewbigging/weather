import { Injectable } from '@angular/core';

import { ModelLoader } from './scene/model-loader';
import { WeatherScene } from './scene/weather-scene';

@Injectable({ providedIn: 'root' })
export class SceneService {
  private modelLoader = new ModelLoader();
  private sceneState?: WeatherScene;

  constructor() {
    // Start loading immediately
    this.modelLoader.load(this.onLoaded);
  }

  private onLoaded = () => {
    // Get the canvas
    const canvas = document.getElementById('scene-canvas') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Could not find scene canvas');
      return;
    }

    this.sceneState = new WeatherScene(canvas, this.modelLoader);

    this.sceneState.start();
  };
}
