import { Injectable } from '@angular/core';
import * as THREE from "three";

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  listener:THREE.AudioListener;
  dest:THREE.Audio;
  defaultVolume:number;
  currentSliderVolume:number;
  time: THREE.Clock;
  analyser: THREE.AudioAnalyser;
  isPlaying: boolean;

  constructor()
  {
    this.listener = new THREE.AudioListener();
    this.dest = new THREE.Audio(this.listener);
    this.defaultVolume = 0.5;
    this.currentSliderVolume = this.defaultVolume;
    this.time = new THREE.Clock();
    this.analyser = new THREE.AudioAnalyser(this.dest, 2048);
    this.isPlaying = false;
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
    this.dest.setVolume(0);
    this.dest.play();
    this.fadein();
  }

  pause()
  {
    this.isPlaying = false;
    setTimeout(()=>{
      this.dest.pause();
    }, 850);

    this.time.start();
    this.fadeout();
  }

  stop()
  {
    this.isPlaying = false;
    setTimeout(()=>{
      this.dest.stop();
    }, 850);

    this.time.start();
    this.fadeout();
  }

  setVolume(value:number) {
    if (this.isPlaying) {
      this.dest.setVolume(value);
    }
    this.currentSliderVolume = value;
  }


  fadeout()
  {
    if(this.dest.getVolume() >= 0)
    {
      this.dest.setVolume(this.dest.getVolume() - 0.02);
      setTimeout(()=>{
        this.fadeout();
      }, 1);
    }
    else {
      //console.log(this.time.getElapsedTime());
      this.dest.setVolume(0);
    }
  }

  fadein()
  {
    if(this.dest.getVolume() <= this.currentSliderVolume)
    {
      this.dest.setVolume(this.dest.getVolume() + 0.02);
      setTimeout(()=>{
        this.fadein();
      }, 1);
    }
    else {
      this.dest.setVolume(this.currentSliderVolume);
      this.isPlaying = true;
    }
  }
}
