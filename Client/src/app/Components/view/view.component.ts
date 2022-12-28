import {Component, ElementRef, ViewChild} from '@angular/core';
import {WebGlService} from "../../Services/web-gl.service";
import * as THREE from "three";
import {gsap} from "gsap";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {ShadersService} from "./shaders.service";
import {SessionValuesService} from "../../Services/session-values.service";

@Component({
  selector: 'view',
  template: '<canvas width="100"  #view></canvas>'
})
export class ViewComponent {
  // @ts-ignore
  @ViewChild('view') view: ElementRef<HTMLCanvasElement>;
  scene: THREE.Scene = new THREE.Scene();
  camera:THREE.PerspectiveCamera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
  // @ts-ignore
  renderer:THREE.WebGLRenderer;
  renderingParent: THREE.Group = new THREE.Group();
  particles: THREE.Points = new THREE.Points();
  time: THREE.Clock = new THREE.Clock();

  sphereMaterial: THREE.ShaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
      uWidth: { value: 1.0 },
      uDepth: { value: 1.0 },
      uDisplacementStrength: { value: 0.06 },
      uDistortionFrequency: { value: 2.0},
      uDistortionStrength: { value: 1.0},
      uDisplacementFrequency: { value: 2.0},
    },
    vertexShader: this.shaderStore.vertexShader,
    fragmentShader: this.shaderStore.fragmentShader
  });

  sphereClarity:number = 0.06;
  sphereWidth:number = 1.0;
  sphereDepth:number = 1.0;
  sphereImmersion:number = 0.0;

  constructor(private sliderValues: SessionValuesService, private webGl: WebGlService, private shaderStore: ShadersService) {
  }

  ngOnInit() {

    THREE.Cache.enabled = true;
    this.time.start();

    this.sliderValues.clarity.subscribe(clarity => {
      this.sphereClarity = clarity;
    });

    this.sliderValues.width.subscribe(width => {
      this.sphereWidth = width;
    });

    this.sliderValues.depth.subscribe(depth => {
      this.sphereDepth = depth;
    });

    this.sliderValues.immersion.subscribe(immersion => {
      this.sphereImmersion = immersion;
    });

  }

  ngAfterViewInit()
  {
    if(!this.webGl.isWebGlAvailable()) {
      window.alert("error, webGL not available");
    }
    else {

      this.initRenderer();
      window.addEventListener("resize", this.onWindowResize)

      //this.particles = this.generateParticles();
      let renderingParent = new THREE.Group();
      //renderingParent.add(this.particles);
      this.generateSoundSphere();

      this.scene.add(renderingParent);
      this.scene.background = new THREE.TextureLoader().load('assets/Images/UR-music-studio-1000.jpg');

      this.camera.position.z = 2.5;
      let orbitControls = new OrbitControls(this.camera, this.renderer.domElement);

      let animate = () => {
        requestAnimationFrame(animate);
        this.renderer.render(this.scene, this.camera);
        this.updateSoundSphere();
      }
      animate();

      let animProps = {scale: .75, xRot: 0, yRot: 0};

      gsap.to(animProps, {
        duration: 10, scale: .8, repeat: -1, yoyo: true, ease: "sine", onUpdate: function () {
          renderingParent.scale.set(animProps.scale, animProps.scale, animProps.scale);
        }
      });

      gsap.to(animProps, {
        duration: 20,
        xRot: Math.PI * 2,
        yRot: Math.PI * 4,
        repeat: -1,
        yoyo: true,
        ease: "none",
        onUpdate: function () {
          renderingParent.rotation.set(animProps.scale, animProps.scale, animProps.scale);
        }
      });
    }
  }

  //graphics generators

  generateSoundSphere()
  {
    let geometry = new THREE.SphereGeometry(1, 1024, 1024);
    let mesh = new THREE.Mesh(geometry, this.sphereMaterial);
    this.scene.add(mesh);
  }

  updateSoundSphere()
  {
    this.sphereMaterial.uniforms['uTime'].value = this.time.getElapsedTime() * 0.1;
    this.sphereMaterial.uniforms['uDisplacementStrength'].value = this.sphereClarity;
    this.sphereMaterial.uniforms['uWidth'].value = this.sphereWidth;
    this.sphereMaterial.uniforms['uDepth'].value = this.sphereDepth;
  }

  generateReverb() {
    for(let i = 0; i < 200; i++)
    {
      let geometry = new THREE.SphereGeometry(1, 32, 32);
      let material = new THREE.MeshStandardMaterial({color: 0x7FFFD4});
      let reverb = new THREE.Mesh(geometry, material);

      let [x, y, z] = Array(3).fill(null).map(() => THREE.MathUtils.randFloatSpread(800));
      reverb.position.set(x, y, z);
      this.scene.add(reverb);
    }
  }

  generateParticles() {
    let geometry = new THREE.BufferGeometry();
    let distance = Math.min(200, window.innerWidth / 4);
    let points = [];

    for (let i = 0; i < 3200; i++) {
      let vertex = new THREE.Vector3();
      let theta = THREE.MathUtils.randFloatSpread(360);
      let phi = THREE.MathUtils.randFloatSpread(360);

      vertex.x = distance * Math.sin(theta) * Math.cos(phi);
      vertex.y = distance * Math.sin(theta) * Math.sin(phi);
      vertex.z = distance * Math.cos(theta);

      points.push(vertex);
    }

    geometry.setFromPoints(points);
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 50);

    return new THREE.Points(geometry, new THREE.PointsMaterial(
      {color: 0xff44ff, size: 1}
    ));
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.view.nativeElement
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
