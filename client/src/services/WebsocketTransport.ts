import { Transport } from './Transport';
import { Action } from '../types/Action';

export class WebsocketTransport implements Transport {
  private URL = 'ws://localhost:8080';
  private socket: WebSocket | undefined;
  constructor() {

  }

  async connect(): Promise<void> {
    this.socket = new WebSocket(this.URL);
    return new Promise(resolve => {
      this.socket!.onopen = () => resolve();
    })
  }

  disconnect(): void {
    this.socket!.close();
  }

  subscribe(callback: (action: Action) => void): void {
    this.socket!.onmessage = (event) => {
      const action = JSON.parse(event.data);
      callback(action);
    }
  }

  send(action: Action) {
    this.socket!.send(JSON.stringify(action));
  }
}
