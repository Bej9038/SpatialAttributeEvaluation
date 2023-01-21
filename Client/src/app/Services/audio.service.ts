import { Injectable } from '@angular/core';
import * as THREE from "three";

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  // @ts-ignore
  listener:THREE.AudioListener;
  // @ts-ignore
  dest:THREE.Audio;
  // @ts-ignore
  defaultVolume:number;
  // @ts-ignore
  currentSliderVolume:number;
  // @ts-ignore
  time: THREE.Clock;
  // @ts-ignore
  analyser: THREE.AudioAnalyser;
  isPlaying: boolean = false;
  // @ts-ignore
  frequencyData: Uint8Array;
  // @ts-ignore
  waveformData: Float32Array;
  analyzerLevel:number = 0;
  // @ts-ignore
  freqLevels:Array<number>;

  initAudioService()
  {
    this.listener = new THREE.AudioListener();
    this.dest = new THREE.Audio(this.listener);
    this.loadAudio("/SpatialAttributeEvaluation/assets/Audio/jazz.mp3");
    //this.loadAudio("/assets/Audio/jazz.mp3");
    this.dest.autoplay = true;
    this.defaultVolume = 0.5;
    this.time = new THREE.Clock();
    this.currentSliderVolume = this.defaultVolume;
    this.analyser = new THREE.AudioAnalyser(this.dest, 2048);
    this.frequencyData = new Uint8Array(this.analyser.analyser.fftSize/2);
    this.analyser.analyser.getByteFrequencyData(this.frequencyData);
    this.waveformData = new Float32Array(this.analyser.analyser.fftSize);
    this.analyser.analyser.getFloatTimeDomainData(this.waveformData);

    this.analyzerLevel = 0;
    this.freqLevels = new Array<number>(3);
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
    if(this.dest)
    {
      this.analyser.analyser.getByteFrequencyData(this.frequencyData);
      this.analyser.analyser.getFloatTimeDomainData(this.waveformData);
      this.updateAnalyzerLevel();
      this.updateFreqLevels();
    }
  }

  updateAnalyzerLevel()
  {
    let arr = this.waveformData;
    let sum = 0.0;
    for(let i = 0; i < arr.length; i++)
    {
      sum += arr[i] * arr[i];
    }

    let target = Math.sqrt(sum/arr.length) / 1.5;
    let upease = 0.1;
    let downease = 0.5;

    this.analyzerLevel < target?
      this.analyzerLevel += (target - this.analyzerLevel) * upease : this.analyzerLevel += (target - this.analyzerLevel) * downease;
  }

  updateFreqLevels()
  {
    let levelCount = 3;
    let levelBins = Math.floor(this.analyser.analyser.fftSize / levelCount);
    for(let i = 0; i < levelCount; i++)
    {
      let sum = 0;
      for(let j = 0; j < levelBins; j++)
      {
        sum += this.frequencyData[(i * levelBins) + j];
      }
      let val = sum / levelBins / 256;
      this.freqLevels[i] = val ? val : 0;
    }
  }

}
