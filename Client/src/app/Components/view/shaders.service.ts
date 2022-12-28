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
    gl_FragColor = vec4(vColor, 1.0);
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
  varying vec3 vColor;

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

    vec4 viewPosition = viewMatrix * vec4(displacedPosition.xyz, 1.0);
    gl_Position = projectionMatrix * viewPosition;

    // colors
    vec3 uLightColorA = vec3(1.0, 0.2, 0.5);
    vec3 uLightPositionA = -vec3(1.0, 1.0, 0.0);
    float lightIntensityA = max(0.0, - dot(normal, normalize(uLightPositionA)));

    vec3 uLightColorB = vec3(0.5, 0.2, 1.0);
    vec3 uLightPositionB = -vec3(-1.0, -0.5, 0.0);
    float lightIntensityB = max(0.0, - dot(normal, normalize(uLightPositionB)));

    vec3 color = vec3(0.0);
    color = mix(color, uLightColorA, lightIntensityA);
    color = mix(color, uLightColorB, lightIntensityB);

    vNormal = normal;
    vPerlinStrength = displacedPosition.a;
    vColor = color;
  }
  `;
}


