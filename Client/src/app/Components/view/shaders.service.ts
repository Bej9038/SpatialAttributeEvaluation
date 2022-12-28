import { Injectable } from '@angular/core';
import {Perlin4dService} from "./perlin4d.service";
import {Perlin3dService} from "./perlin3d.service";
import {NoiseService} from "./noise.service";

@Injectable({
  providedIn: 'root'
})
export class ShadersService {

  constructor(private perlin3d: Perlin3dService, private perlin4d: Perlin4dService, private noise: NoiseService) {}

  fragmentShader:string = `
  varying vec3 vNormal;
  varying vec3 vColor;
  varying float vPerlinStrength;

  void main()
  {
    float temp = vPerlinStrength + 0.1;
    temp *= 2.0;
    gl_FragColor = vec4(temp, temp, temp, 1.0);
  }
  `;

  vertexShader:string = this.perlin4d.src + this.perlin3d.src + `
  uniform float uTime;
  uniform float uDisplacementStrength;
  uniform float uWidth;
  uniform float uDepth;

  varying vec3 vNormal;
  varying float vPerlinStrength;

  void main()
  {

    float uDistortionFrequency = 2.0;
    float uDistortionStrength = 1.0;
    float uDisplacementFrequency = 2.0;
    float tempstrength = 0.2;
    float uTimeStrength = 0.2;

    vec3 displacementPosition = position;
    displacementPosition += perlin4d(vec4(displacementPosition * uDisplacementFrequency, uTime * uTimeStrength)) * uDistortionStrength;

    float perlinStrength = perlin4d(vec4(displacementPosition * uDisplacementFrequency, uTime * uTimeStrength)) * tempstrength;

    vec3 newPosition = position;
    newPosition += normal * perlinStrength;

    newPosition.x *= uWidth;
    newPosition.z *= uDepth;
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    vNormal = normal;
    vPerlinStrength = perlinStrength;
  }
  `;
}


