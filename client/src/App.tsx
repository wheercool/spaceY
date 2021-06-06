import React, { createRef } from 'react';
import './App.css';
import { Renderer } from './services/Renderer';
import { ClientGame } from './services/ClientGame';
import { Controller } from './services/Controller';
import { WebsocketTransport } from './services/WebsocketTransport';
import { Transport } from './services/Transport';
import { DebugWebsocketTransport } from './services/DebugWebsocketTransport';

class App extends React.Component {
  canvasRef = createRef<HTMLCanvasElement>();
  WIDTH = 800;
  HEIGHT = 600;
  game!: ClientGame;

  componentDidMount() {
    if (!this.canvasRef.current) {
      return;
    }
    const renderer = new Renderer(this.canvasRef.current)
    const controller: Controller = new Controller();
    // const transport: Transport = new WebsocketTransport();
    const transport: Transport = new DebugWebsocketTransport();
    this.game = new ClientGame(controller, transport, renderer);
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
