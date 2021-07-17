import { AudioListener, LoadingManager } from 'three';

export interface AudioAsset {
  url: string;
  audio?: HTMLAudioElement;
  speed: number;
}

interface PlayOptions {
  loop: boolean;
}

export class SoundManager {
  private audioListener: AudioListener;
  listener = new AudioListener();
  assets: Record<string, AudioAsset> = {
    spaceAmbient: {
      url: 'space_ambient.wav',
      speed: 1
    },
    upgrade: {
      url: 'upgrade.wav',
      audio: undefined,
      speed: 1
    },
    action: {
      url: 'action.wav',
      audio: undefined,
      speed: 1
    },
    buy: {
      url: 'buy.wav',
      audio: undefined,
      speed: 1
    },
    use: {
      url: 'use.wav',
      audio: undefined,
      speed: 1
    },
    button: {
      url: 'button.wav',
      audio: undefined,
      speed: 1
    },
    completed: {
      url: 'completed.wav',
      audio: undefined,
      speed: 1
    },
    failed: {
      url: 'failed.wav',
      audio: undefined,
      speed: 1
    },
    tutorial: {
      url: 'tutorial.wav',
      audio: undefined,
      speed: 1
    },
    space: {
      url: 'space.wav',
      audio: undefined,
      speed: 1
    },
    step_done: {
      url: 'step_done.wav',
      audio: undefined,
      speed: 1
    },
    quest: {
      url: 'quest.ogg',
      audio: undefined,
      speed: 1
    },
    laser: {
      url: 'laser.wav',
      audio: undefined,
      speed: 2
    },
    gravity: {
      url: 'gravity.wav',
      audio: undefined,
      speed: 1
    },
    engine: {
      url: 'engine.wav',
      audio: undefined,
      speed: 1
    }
  }
  private ambient: HTMLAudioElement | undefined;

  constructor() {
    this.audioListener = new AudioListener();
  }

  load(manager: LoadingManager) {
    for (const config of Object.values(this.assets)) {
      const url = config.url;
      const fullUrl = `assets/audio/${url}`
      const audio = new Audio(fullUrl);
      audio.addEventListener('loadeddata', () => {
        config.audio = audio;
        config.audio.playbackRate = config.speed;
        manager.itemEnd(fullUrl);
      })
      manager.itemStart(fullUrl);
      audio.load();
    }
  }

  stopAmbient() {
    if (this.ambient) {
      this.ambient.pause();
      this.ambient.currentTime = 0;
    }
  }
  playAmbient(sound: keyof SoundManager['assets']) {
    if (this.ambient) {
      if (this.ambient === this.assets[sound].audio) {
        return;
      }
      this.ambient.pause();
      this.ambient.currentTime = 0;
    }
    this.ambient = this.assets[sound].audio;
    if (this.ambient) {
      this.ambient.loop = true;
      this.ambient.play();
    }
  }
  play(sound: keyof SoundManager['assets'], options: Partial<PlayOptions> | undefined = undefined) {
    const audio = this.assets[sound].audio;
    if (audio) {
      audio.loop = options?.loop ?? false;
      if (!audio.loop) {
        audio.pause();
        audio.currentTime = 0;
      }
      audio.play();
    }
  }

  stop(sound: string) {
    const audio = this.assets[sound].audio;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }
}

export const soundManager = new SoundManager();