import { Action } from '@shared/types/Action';


export class DebugWebsocketTransport {
  private PING_INTERVAL = 2000;

  get rtt(): number {
    return this._rtt;
  }

  private _rtt = -1;
  private URL = 'ws://localhost:8080';
  private socket: WebSocket | undefined;
  private readonly clientDelay: number = 0;
  private readonly serverDelay: number = 0;
  private readonly fluctuation: number = 0;
  private pingAt = -1;

  constructor() {
    const params = new URLSearchParams(window.location.search);
    this.clientDelay = Number(params.get('client_delay') ?? 0);
    this.serverDelay = Number(params.get('server_delay') ?? 0);
    this.fluctuation = Number(params.get('fluctuation') ?? 0);
  }

  async connect(): Promise<void> {
    this.socket = new WebSocket(this.URL);
    setInterval(() => {
      this.pingAt = Date.now();
      this.send('ping');
    }, this.PING_INTERVAL)
    return new Promise(resolve => {
      this.socket!.onopen = () => resolve();
    })
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }

  subscribe(callback: (action: Action) => void): void {
    if (!this.socket) {
      throw new Error(`You should be connected`);
    }
    this.socket.onmessage = (event) => {
      const action = JSON.parse(event.data);
      const delay = Math.ceil(Math.random() * this.fluctuation) + this.serverDelay;
      if (delay === 0) {
        if (typeof action === 'string' && action.toLowerCase() === 'pong') {
          this._rtt = Date.now() - this.pingAt;
        }
        callback(action);
      } else {
        setTimeout(() => {
          if (typeof action === 'string' && action.toLowerCase() === 'pong') {
            this._rtt = Date.now() - this.pingAt;
          }
          callback(action);
        }, delay);
      }
    }
  }

  send(action: Action | 'ping') {
    const delay = Math.ceil(Math.random() * this.fluctuation) + this.clientDelay;
    if (delay === 0) {
      this.socket!.send(JSON.stringify(action))
    } else {
      setTimeout(() => {
        if (!this.socket) {
          throw new Error(`You should be connected`);
        }
        this.socket.send(JSON.stringify(action))
      }, delay);
    }
  }
}
