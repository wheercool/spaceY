import React, { createRef, useEffect } from 'react';
import { Game } from './systems/Game';
import { assetsManager } from './services/AssetsManager';
import { WebGL3DRendererSystem } from './systems/WebGL3DRendererSystem';

function App() {
  const canvasRef = createRef<HTMLCanvasElement>();
  const WIDTH = window.innerWidth - 10;
  const HEIGHT = window.innerHeight - 100;

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const renderer = new WebGL3DRendererSystem(canvasRef.current)
    assetsManager.load().then(() => {
      new Game(renderer).startGame();
    })
  }, []);

  return <div className="app">
    <canvas style={{ padding: 5, width: WIDTH, height: HEIGHT }} width={WIDTH} height={HEIGHT} ref={canvasRef}/>
  </div>
}


export default App;
