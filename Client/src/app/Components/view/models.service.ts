import { Injectable } from '@angular/core';
import * as THREE from "three";
import {ShadersService} from "./shaders.service";

@Injectable({
  providedIn: 'root'
})
export class ModelsService {

  offsetSphr: THREE.Spherical;
  offsetDir: THREE.Vector3;
  sphereSubdivs: number = 1024;
  sphereRad: number = 1.25;

  // @ts-ignore
  sphereGeometry: THREE.SphereGeometry;
  // @ts-ignore
  sphereMaterial: THREE.ShaderMaterial;
  // @ts-ignore
  sphereObject: THREE.Mesh;

  // @ts-ignore
  immersionGeometry: THREE.BufferGeometry;
  // @ts-ignore
  immersionMaterial: THREE.PointsMaterial;
  // @ts-ignore
  immersionObject: THREE.Points;
  // @ts-ignore
  immersionPositionArr: Float32Array;
  numImmersionParticles:number = 10000;

  // @ts-ignore
  planeGeometry: Array<THREE.PlaneGeometry>;
  // @ts-ignore
  planeMaterial: Array<THREE.MeshBasicMaterial>;
  // @ts-ignore
  planeObject: Array<THREE.Mesh>;

  planeSize:number = 7.5;


  constructor(private shaderStore: ShadersService) {
    this.immersionPositionArr = new Float32Array(this.numImmersionParticles * 3);
    this.offsetSphr = new THREE.Spherical(1, Math.random() * Math.PI, Math.random() * Math.PI * 2);
    this.offsetDir = new THREE.Vector3();
    this.offsetDir.setFromSpherical(this.offsetSphr);
  }

    getRoomObject()
    {
      return this.planeObject;
    }

    generateRoom()
    {
      this.planeObject = new Array<THREE.Mesh>()
      this.initRoomGeometry();
      this.initRoomMaterial();
      for(let i = 0; i < 4; i++)
      {
        this.planeObject[i] = new THREE.Mesh(this.planeGeometry[i], this.planeMaterial[0]);
      }

      //backwall
      this.planeObject[0].position.set(0, 0, -this.planeSize/2);

      //leftwall
      this.planeObject[1].rotateY(Math.PI/2);
      this.planeObject[1].position.set(-this.planeSize/2, 0, 0);

      //floor
      this.planeObject[2] = new THREE.Mesh(this.planeGeometry[2], this.planeMaterial[1]);
      this.planeObject[2].rotateX(Math.PI/2);
      this.planeObject[2].position.set(0, -this.planeSize/2, 0);

      //rightwall
      this.planeObject[3].rotateY(Math.PI/2);
      this.planeObject[3].position.set(this.planeSize/2, 0, 0);
  }

  initRoomGeometry()
  {
    this.planeGeometry = new Array<THREE.PlaneGeometry>();
    for(let i = 0; i < 4; i++)
    {
      this.planeGeometry[i] = new THREE.PlaneGeometry(this.planeSize, this.planeSize);
    }
  }

  initRoomMaterial()
  {
    this.planeMaterial = new Array<THREE.MeshBasicMaterial>();
    this.planeMaterial[0] = new THREE.MeshBasicMaterial({
        color: 0x726B6B,
        side: THREE.DoubleSide
      });

    this.planeMaterial[1] = new THREE.MeshBasicMaterial({
      color: 0xD4CBCB,
      side: THREE.DoubleSide
    });
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
    this.immersionObject.scale.set(this.planeSize - .5, this.planeSize - .5, this.planeSize - .5);
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
        size: 0.02,
        opacity: 0.75,
        transparent: true,
        color: 'red'
      }
    );
  }
}
