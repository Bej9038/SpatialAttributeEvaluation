import { Injectable } from '@angular/core';
import {Perlin4dService} from "./perlin4d.service";
import {Perlin3dService} from "./perlin3d.service";

@Injectable({
  providedIn: 'root'
})
export class ShadersService {

  perlin3d = new Perlin3dService();
  perlin4d = new Perlin4dService();

  fragmentShader:string = `
  varying vec3 vNormal;
  varying vec3 vColor;

  void main()
  {
    gl_FragColor = vec4(vNormal, 1.0);
  }
  `;

  vertexShader:string = this.perlin4d.src + this.perlin3d.src + `
  uniform float uTime;

  varying vec3 vNormal;

  void main()
  {
    vec3 newPosition = position;
    float uDisplacementFrequency = 3.0;
    float uDisplacementStrength = 10.0;
    float uDistortionFrequency = 5.0;
    float uTimeStrength = 0.75;
    float uDistTimeStrength = 0.6;

    vec3 displacementPosition = position * uDisplacementFrequency;
    displacementPosition.x += perlin3d(vec3(position.yz * uDistortionFrequency, uTime * uDistTimeStrength));
    displacementPosition.y += perlin3d(vec3(position.xz * uDistortionFrequency, uTime * uDistTimeStrength));
    displacementPosition.z += perlin3d(vec3(position.xy * uDistortionFrequency, uTime * uDistTimeStrength));

    float perlinStrength = perlin4d(vec4(displacementPosition, uTime * uTimeStrength)) * uDisplacementStrength;

    newPosition += normal * perlinStrength;
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    vNormal = normal;
  }
  `;
}
