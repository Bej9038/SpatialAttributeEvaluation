import { Injectable } from '@angular/core';
import * as THREE from "three";

@Injectable({
  providedIn: 'root'
})
export class ModelsService {

  // @ts-ignore
  immersionGeometry: THREE.BufferGeometry;
  // @ts-ignore
  immersionMaterial: THREE.PointsMaterial;
  // @ts-ignore
  immersionObject: THREE.Points;
  // @ts-ignore
  immersionPositionArr: Float32Array;

  numImmersionParticles:number = 10000;

  constructor() {
    this.immersionPositionArr = new Float32Array(this.numImmersionParticles * 3);
  }

  getImmersionObject()
  {
    return this.immersionObject;
  }

  generateImmersion()
  {
    this.initImmersionGeometry();
    this.initImmersionMaterial();
    this.immersionObject = new THREE.Points(this.immersionGeometry, this.immersionMaterial);
    this.immersionObject.scale.set(5, 5, 5);
  }

  initImmersionGeometry()
  {
    this.immersionGeometry = new THREE.BufferGeometry();
    for(let i = 0; i < this.immersionPositionArr.length; i++)
    {
      this.immersionPositionArr[i] = Math.random() - 0.5;
    }
    this.immersionGeometry.setAttribute('position', new THREE.BufferAttribute(this.immersionPositionArr, 3));
  }

  initImmersionMaterial()
  {
    this.immersionMaterial = new THREE.PointsMaterial(
      {
        size: 0.01,
        opacity: 0.75,
        transparent: true,
        color: 'red'
      }
    );
  }
}
