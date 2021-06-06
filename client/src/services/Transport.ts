import { Action } from '@shared/types/Action';

export interface Transport {
  connect(): Promise<void>;

  disconnect(): void;

  subscribe(callback: (message: Action) => void): void;

  send(message: Action): void;
}
