import { Injectable } from '@angular/core';
import * as THREE from "three";

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  listener:THREE.AudioListener;
  dest:THREE.Audio;
  defaultVolume:number;

  constructor()
  {
    this.listener = new THREE.AudioListener();
    this.dest = new THREE.Audio(this.listener);
    this.defaultVolume = 0.5;
  }
  loadAudio(url:string)
  {
    let loader = new THREE.AudioLoader();
    loader.load(url, (buffer) => {
      this.dest.setBuffer(buffer);
      this.dest.setLoop(true);
      this.dest.setVolume(this.defaultVolume);
    });
  }

  play()
  {
    this.dest.play();
  }

  pause()
  {
    this.dest.pause();
  }

  stop()
  {
    this.dest.stop();
  }
}
