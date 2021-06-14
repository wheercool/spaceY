import React, { createRef } from 'react';
import './App.css';
import { Renderer } from './systems/Renderer';
import { Game } from './systems/Game';

class App extends React.Component {
  canvasRef = createRef<HTMLCanvasElement>();
  WIDTH = 800;
  HEIGHT = 600;
  game!: Game;

  // game!: ClientGame;

  componentDidMount() {
    if (!this.canvasRef.current) {
      return;
    }
    const renderer = new Renderer(this.canvasRef.current)
    // const controller: Controller = new Controller();
    // // const transport: Transport = new WebsocketTransport();
    // const transport: Transport = new DebugWebsocketTransport();
    this.game = new Game(renderer);
    this.game.startGame();
  }

  render() {
    return <div className="app">
      <h1>Game</h1>
      <canvas width={this.WIDTH} height={this.HEIGHT} ref={this.canvasRef}/>
    </div>
  }
}


export default App;
