import { Injectable } from '@angular/core';
import {Perlin4dService} from "./perlin4d.service";
import {Perlin3dService} from "./perlin3d.service";

@Injectable({
  providedIn: 'root'
})
export class ShadersService {

  constructor(private perlin3d: Perlin3dService, private perlin4d: Perlin4dService) {}

  fragmentShader:string = `
  varying vec3 vNormal;
  varying vec3 vColor;
  varying float vPerlinStrength;

  void main()
  {
    float test = dot(vNormal, vec3(0.0, - 1.0, 0.0));
    gl_FragColor = vec4(test, test, test, 1.0);

    // float temp = vPerlinStrength + 0.5;
    // temp *= 0.5;
    // gl_FragColor = vec4(temp, temp, temp, 1.0);
  }
  `;

  vertexShader:string = this.perlin4d.src + this.perlin3d.src + `
  uniform float uTime;
  uniform float uWidth;
  uniform float uDepth;

  uniform float uDisplacementStrength;
  uniform float uDistortionFrequency;
  uniform float uDistortionStrength;
  uniform float uDisplacementFrequency;

  varying vec3 vNormal;
  varying float vPerlinStrength;

  vec4 getDisplacedPosition(vec3 _position)
  {
    vec3 displacementPosition = _position;
    displacementPosition += perlin4d(vec4(displacementPosition * uDistortionFrequency, uTime)) * uDistortionStrength;

    float perlinStrength = perlin4d(vec4(displacementPosition * uDisplacementFrequency, uTime));

    vec3 displacedPosition =  _position;
    displacedPosition += normalize( _position) * perlinStrength * uDisplacementStrength;
    return vec4(displacedPosition, perlinStrength);
  }

  void main()
  {
    // displaced vertex positions
    vec4 displacedPosition = getDisplacedPosition(position);
    displacedPosition.x *= uWidth;
    displacedPosition.z *= uDepth;

     // colors

    vec4 modelPosition = modelMatrix * vec4(displacedPosition.xyz, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    vNormal = normal;
    vPerlinStrength = displacedPosition.a;
  }
  `;
}


