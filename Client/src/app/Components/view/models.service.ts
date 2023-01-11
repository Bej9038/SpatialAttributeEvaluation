import { Injectable } from '@angular/core';
import * as THREE from "three";
import {ShadersService} from "./shaders.service";

@Injectable({
  providedIn: 'root'
})
export class ModelsService {

  // @ts-ignore
  sphereGeometry: THREE.SphereGeometry;
  // @ts-ignore
  sphereMaterial: THREE.ShaderMaterial;
  // @ts-ignore
  sphereObject: THREE.Mesh;

  offsetSphr: THREE.Spherical;
  offsetDir: THREE.Vector3;
  sphereSubdivs: number = 1024;
  sphereRad: number = 1.0;

  // @ts-ignore
  immersionGeometry: THREE.BufferGeometry;
  // @ts-ignore
  immersionMaterial: THREE.PointsMaterial;
  // @ts-ignore
  immersionObject: THREE.Points;
  // @ts-ignore
  immersionPositionArr: Float32Array;
  numImmersionParticles:number = 10000;

  sphereClarity:number = 0.0;
  sphereWidth:number = 1.0;
  sphereDepth:number = 1.0;
  sphereImmersion:number = 0.0;

  constructor(private shaderStore: ShadersService) {
    this.immersionPositionArr = new Float32Array(this.numImmersionParticles * 3);
    this.offsetSphr = new THREE.Spherical(1, Math.random() * Math.PI, Math.random() * Math.PI * 2);
    this.offsetDir = new THREE.Vector3();
    this.offsetDir.setFromSpherical(this.offsetSphr);
  }

  getSphereObject()
  {
    return this.sphereObject;
  }

  generateSphere()
  {
    this.initSphereGeometry();
    this.initSphereMaterial();
    this.sphereObject = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
  }

  initSphereGeometry()
  {
    this.sphereGeometry = new THREE.SphereGeometry(this.sphereRad, this.sphereSubdivs, this.sphereSubdivs);
    this.sphereGeometry.computeTangents();
  }

  initSphereMaterial()
  {
    let uniforms = THREE.UniformsUtils.merge([
      THREE.UniformsLib["fog"],
      THREE.UniformsLib[ "lights" ],
      {
        //baseTexture: { value: null },
        //bloomTexture: { value: this.bloomComposer.renderTarget2.texture },
        uPerimeter: {value: this.sphereGeometry.parameters.radius},
        uSubDivisions: {value: this.sphereGeometry.parameters.heightSegments},
        uTime: { value: 0.0 },
        uWidth: { value: 1.0 },
        uDepth: { value: 1.0 },
        uOffsetDirection: { value: this.offsetDir },
        uOffsetSpeed: { value: 1.6 },
        uDistortionFrequency: { value: 2.0},
        uDistortionStrength: { value: 1.0},
        uDisplacementStrength: { value: 0.0 },
        uDisplacementFrequency: { value: 2.0},
        uAverageFrequency: { value: 1.0 },
      }
    ]);

    this.sphereMaterial = new THREE.ShaderMaterial({
      lights:true,
      fog:true,
      uniforms: uniforms,
      defines: {
        USE_TANGENT: ''
      },
      vertexShader: this.shaderStore.vertexShader,
      fragmentShader: this.shaderStore.fragmentShader,
    });
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
