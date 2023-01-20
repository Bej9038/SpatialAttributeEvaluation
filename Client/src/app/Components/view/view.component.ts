import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {WebGlService} from "../../Services/web-gl.service";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {SessionValuesService} from "../../Services/session-values.service";
import {AudioService} from "../../Services/audio.service";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {ModelsService} from "./models.service";

@Component({
  selector: 'view',
  template: '<canvas width="100" style="display: block;" #view></canvas>'
})
export class ViewComponent {
  // @ts-ignore
  @ViewChild('view') view: ElementRef<HTMLCanvasElement>;
  // @ts-ignore
  renderer:THREE.WebGLRenderer;
  // @ts-ignore
  bloomComposer: EffectComposer;
  // @ts-ignore
  finalComposer: EffectComposer;
  // @ts-ignore
  controls: OrbitControls;
  renderScene: RenderPass;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  time: THREE.Clock;
  bloomLayer: THREE.Layers;

  sphereClarity:number = 0.0;
  sphereWidth:number = 1.0;
  sphereDepth:number = 1.0;
  sphereImmersion:number = 0.0;

  constructor(public models:ModelsService, public audio:AudioService, private sessionValues: SessionValuesService, private webGl: WebGlService) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderScene = new RenderPass(this.scene, this.camera);
    this.time = new THREE.Clock();
    this.bloomLayer = new THREE.Layers();
  }

  ngOnInit() {
    THREE.Cache.enabled = true;
    this.time.start();
    this.bloomLayer.set(1);

    this.sessionValues.clarity.subscribe(clarity => {
      this.sphereClarity = clarity;
    });
    this.sessionValues.width.subscribe(width => {
      this.sphereWidth = width;
    });
    this.sessionValues.depth.subscribe(depth => {
      this.sphereDepth = depth;
    });
    this.sessionValues.immersion.subscribe(immersion => {
      this.sphereImmersion = immersion;
    });
  }

  ngAfterViewInit()
  {
    if(!this.webGl.isWebGlAvailable())
    {
      window.alert("error, webGL not available");
    }
    else
    {
      this.initRenderer();
      this.initBloom();

      this.models.generateRoom();
      for(let i = 0; i < this.models.getRoomObject().length - 1; i++) {
        this.scene.add(this.models.getRoomObject()[i]);
      }

      this.models.generateImmersion();
      this.scene.add(this.models.getImmersionObject());

      this.models.generateSphere();
      this.scene.add(this.models.getSphereObject());

      this.initOrbitControls();

      let animate = () => {
        requestAnimationFrame(animate);
        this.renderer.render(this.scene, this.camera);
        //this.bloomComposer.render();
        this.updateGraphics();
      }
      animate();
    }
  }

  // utility functions

  initRenderer() {
    let renderer = new THREE.WebGLRenderer({
      canvas: this.view.nativeElement,
      antialias: true
  });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer = renderer;
  }

  initBloom()
  {
    this.bloomComposer = new EffectComposer(this.renderer);
    this.finalComposer = new EffectComposer(this.renderer);

    let bloom = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1, 1, 0);
    this.bloomComposer.addPass(this.renderScene);
    this.bloomComposer.addPass(bloom);

    let finalpass = new ShaderPass(this.models.sphereMaterial, 'baseTexture');
    finalpass.needsSwap = true;
    this.finalComposer.addPass(this.renderScene);
    this.finalComposer.addPass(finalpass);
  }

  initOrbitControls()
  {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    //this.controls.enableZoom = false;
    this.controls.maxAzimuthAngle = Math.PI/2;
    this.controls.minAzimuthAngle = 0;
    this.controls.maxPolarAngle = Math.PI/2;

    this.camera.position.set(3, 1.5, 5);
    this.camera.rotateY(Math.PI/6.25);
    this.camera.rotateX(-Math.PI/11);

    this.controls.update();
  }

  updateGraphics()
  {
    this.audio.updateAnalyzerData();

    let scaler = this.sphereImmersion/2 + 3.5;
    this.models.getImmersionObject().scale.set(scaler, scaler, scaler);

    this.models.getImmersionObject().geometry.setAttribute('position',
      new THREE.BufferAttribute(this.models.immersionPositionArr.slice(0, this.sphereImmersion * 100 * 3), 3));

    this.models.getImmersionObject().rotateY(0.0002);
    this.models.getImmersionObject().rotateX(0.00015);

    this.models.sphereMaterial.uniforms['uTime'].value = this.time.getElapsedTime() * 0.8;
    this.models.sphereMaterial.uniforms['uDisplacementStrength'].value = this.sphereClarity + this.audio.analyzerLevel;
    this.models.sphereMaterial.uniforms['uWidth'].value = this.sphereWidth;
    this.models.sphereMaterial.uniforms['uDepth'].value = this.sphereDepth;
    //this.models.sphereMaterial.uniforms['uAverageFrequency'].value = this.audio.analyser.getAverageFrequency();

    let t = this.time.getElapsedTime() * 25;
    this.models.offsetSphr.phi = ((Math.sin(t * 0.0056) * Math.sin(t * 0.0048)) * 0.5 + 0.5) * Math.PI;
    this.models.offsetSphr.theta = ((Math.sin(t * 0.0024) * Math.sin(t * 0.00152)) * 0.5 + 0.5) * Math.PI * 2;
    this.models.offsetDir.setFromSpherical(this.models.offsetSphr);
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
