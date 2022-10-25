import { Injectable } from '@angular/core';
import {Perlin4dService} from "./perlin4d.service";

@Injectable({
  providedIn: 'root'
})
export class ShadersService {

  perlin4d = new Perlin4dService();

  fragmentShader:string = `
  varying vec3 vNormal;
  varying vec3 vColor;

  void main()
  {
    gl_FragColor = vec4(vNormal, 1.0);
  }
  `;

  vertexShader:string = this.perlin4d.perlid4d + `
  uniform float uTime;

  varying vec3 vNormal;

  void main()
  {
    vec3 newPosition = position;
    float uFrequency = 5.0;
    float uStrength = 10.0;
    float perlinStrength = perlin4d(vec4(position * uFrequency, uTime)) * uStrength;
    newPosition += normal * perlinStrength;

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    vNormal = normal;
  }
  `;
}
