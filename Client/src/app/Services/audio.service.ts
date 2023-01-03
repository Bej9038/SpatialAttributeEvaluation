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
  frequencyData: Float32Array;
  // waveformData: Float32Array;
  waveformData: Float32Array;
  avgFrequency: number;
  analyzerLevel:number;

  constructor()
  {
    this.listener = new THREE.AudioListener();
    this.dest = new THREE.Audio(this.listener);
    this.defaultVolume = 0.5;
    this.currentSliderVolume = this.defaultVolume;
    this.time = new THREE.Clock();
    this.isPlaying = false;

    this.analyser = new THREE.AudioAnalyser(this.dest, 2048);
    this.frequencyData = new Float32Array(this.analyser.analyser.fftSize/2);
    this.analyser.analyser.getFloatFrequencyData(this.frequencyData);
    this.waveformData = new Float32Array(this.analyser.analyser.fftSize);
    this.analyser.analyser.getFloatTimeDomainData(this.waveformData);
    this.avgFrequency = this.analyser.getAverageFrequency();
    this.analyzerLevel = 0;
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

  updateAnalyzerData()
  {
    this.analyser.analyser.getFloatFrequencyData(this.frequencyData);
    this.analyser.analyser.getFloatTimeDomainData(this.waveformData);
    this.updateAnalyzerLevel();
  }

  updateAnalyzerLevel()
  {
    let arr = this.waveformData;
    let sum = 0.0;
    for(let i = 0; i < arr.length; i++)
    {
      sum += arr[i] * arr[i];
    }
    let target = Math.sqrt(sum/arr.length) / 2.0;
    let upease = 0.1;
    let downease = 0.5;

    this.analyzerLevel < target?
      this.analyzerLevel += (target - this.analyzerLevel) * upease : this.analyzerLevel += (target - this.analyzerLevel) * downease;
  }
}
