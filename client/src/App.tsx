import React, { createRef } from 'react';
import './App.css';
import { Game } from './systems/Game';
import { assetsManager } from './services/AssetsManager';
import { WebGL3DRenderer } from './systems/WebGL3DRenderer';

class App extends React.Component {
  canvasRef = createRef<HTMLCanvasElement>();
  WIDTH = window.innerWidth - 10;
  HEIGHT = window.innerHeight - 100;
  game!: Game;

  // game!: ClientGame;

  async componentDidMount() {
    if (!this.canvasRef.current) {
      return;
    }
    const renderer = new WebGL3DRenderer(this.canvasRef.current)
    // const controller: Controller = new Controller();
    // // const transport: Transport = new WebsocketTransport();
    // const transport: Transport = new DebugWebsocketTransport();
    await assetsManager.load();
    this.game = new Game(renderer);
    this.game.startGame();
  }

  render() {
    return <div className="app">
      <h1>Game</h1>
      <canvas style={{ padding: 5, width: this.WIDTH, height: this.HEIGHT }} width={this.WIDTH} height={this.HEIGHT} ref={this.canvasRef}/>
    </div>
  }
}


export default App;
