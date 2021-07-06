import { EntityId } from '../types';

export interface TimerComponent {
  target: EntityId;
  name: string; // name of the timer
  elapsed: number; //ms
  duration: number; // ms
  onFinish: OnTimerFinished; //what to do with timer
}

export enum OnTimerFinished {
  Destroy,
  Keep,
  Restart
}

interface StartTimerParams {
  name?: string;
  onFinish?: OnTimerFinished; //what to do with timer
}

export function startTimer(target: EntityId, duration: number, params: StartTimerParams = {}): TimerComponent {
  const timer: TimerComponent = {
    target,
    duration,
    name: params.name ?? '',
    onFinish: params.onFinish ?? OnTimerFinished.Destroy,
    elapsed: duration
  }
  return timer;
}
