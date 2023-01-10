import { Injectable } from '@angular/core';
import {Perlin4dService} from "./perlin4d.service";
import {Perlin3dService} from "./perlin3d.service";

@Injectable({
  providedIn: 'root'
})
export class ShadersService {

  constructor(private perlin3d: Perlin3dService, private perlin4d: Perlin4dService) {}

  fragmentShader:string = `
  #include <fog_pars_fragment>
  varying vec3 vNormal;
  varying vec3 vColor;
  varying float vPerlinStrength;

  void main()
  {
    float test = dot(vColor, vec3(0.0, - 1.0, 0.0));
    gl_FragColor = vec4(vColor, 1.0);

    #include <fog_fragment>
  }
  `;

  vertexShader:string = this.perlin4d.src + this.perlin3d.src + `
  #include <fog_pars_vertex>
  #define M_PI 3.1415926535897932384626433832795

  uniform float uTime;
  uniform float uWidth;
  uniform float uDepth;
  uniform float uRadius;
  uniform float uSubDivisions;

  uniform vec3 uOffsetDirection;
  uniform float uOffsetSpeed;

  uniform float uDistortionFrequency;
  uniform float uDistortionStrength;
  uniform float uDisplacementStrength;
  uniform float uDisplacementFrequency;

  uniform float uAverageFrequency;

  varying vec3 vNormal;
  varying float vPerlinStrength;
  varying vec3 vColor;

  vec4 getDisplacedPosition(vec3 _position)
  {
    vec3 offsetPosition = uOffsetDirection * uOffsetSpeed;
    //vec3 offsetPosition = vec3(0.0, 0.0, 0.0) * uTime * 20.0;

    vec3 displacementPosition = _position;
    displacementPosition += perlin4d(vec4(displacementPosition * uDistortionFrequency + offsetPosition, uTime)) * uDistortionStrength;

    float perlinStrength = perlin4d(vec4(displacementPosition * uDisplacementFrequency + offsetPosition, uTime));

    vec3 displacedPosition =  _position;
    displacedPosition += normalize(_position) * perlinStrength * uDisplacementStrength;
    return vec4(displacedPosition, perlinStrength);
  }

  void main()
  {
    #include <begin_vertex>
    #include <project_vertex>
    #include <fog_vertex>

    vec3 stretchPosition = position;
    stretchPosition.x *= uWidth;
    stretchPosition.z *= uDepth;

    // displaced vertex positions
    vec4 displacedPosition = getDisplacedPosition(stretchPosition);

    vec4 viewPosition = viewMatrix * vec4(displacedPosition.xyz, 1.0);
    gl_Position = projectionMatrix * viewPosition;

    // colors
    vec3 uLightColorA = vec3(1.0, -1.0, 0.5);
    vec3 uLightPositionA = -vec3(2.5, 2.5, 0.0);
    float lightIntensityA = max(0.0, - dot(normal, normalize(uLightPositionA)));

    vec3 uLightColorB = vec3(1.0, -1.0, 0.5);
    vec3 uLightPositionB = -vec3(-2.5, -2.5, 0.0);
    float lightIntensityB = max(0.0, - dot(normal, normalize(uLightPositionB)));

    //vec3 color = vec3(uAverageFrequency/50.0);
    vec3 color = vec3(0);
    color = mix(color, uLightColorA, lightIntensityA);
    color = mix(color, uLightColorB, lightIntensityB);

    vNormal = normal;
    vPerlinStrength = displacedPosition.a;
    vColor = color;
  }
  `;
}


