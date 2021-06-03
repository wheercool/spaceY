import React, { createRef } from 'react';
import './App.css';
import { Renderer } from './services/Renderer';
import { Game } from './services/Game';
import { Controller } from './services/Controller';
import { WebsocketTransport } from './services/WebsocketTransport';
import { Transport } from './services/Transport';

class App extends React.Component {
  canvasRef = createRef<HTMLCanvasElement>();
  WIDTH = 800;
  HEIGHT = 600;
  game!: Game;

  componentDidMount() {
    if (!this.canvasRef.current) {
      return;
    }
    const renderer = new Renderer(this.canvasRef.current)
    const controller: Controller = new Controller();
    const transport: Transport = new WebsocketTransport();
    this.game = new Game(controller, transport, renderer);
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
