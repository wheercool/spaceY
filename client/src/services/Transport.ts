import { Action } from '@shared/types/Action';

export interface Transport {
  readonly rtt: number;

  connect(): Promise<void>;

  disconnect(): void;

  subscribe(callback: (message: Action) => void): void;

  send(message: Action): void;
}
