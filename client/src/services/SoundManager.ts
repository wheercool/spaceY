import { AudioListener, Audio, LoadingManager, AudioLoader } from 'three';

export interface AudioAsset {
  url: string;
  audio: Audio;
}

export class SoundManager {
  private audioListener: AudioListener;
  listener = new  AudioListener();
  assets: Record<string, AudioAsset> = {
    spaceAmbient: {
      url: '',
      audio: new Audio(this.listener)
    }
  }

  constructor() {
    this.audioListener = new AudioListener();
  }
  load(manager: LoadingManager) {
    const loader = new AudioLoader(manager);
    for (const {url, audio} of Object.values(this.assets)) {
      loader.load(`assets/audio/${url}`, (buffer) => {
        audio.setBuffer(buffer);
      })
    }
  }
}