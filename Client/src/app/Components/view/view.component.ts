import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {WebGlService} from "../../Services/web-gl.service";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {ShadersService} from "./shaders.service";
import {SessionValuesService} from "../../Services/session-values.service";
import {AudioService} from "../../Services/audio.service";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";

@Component({
  selector: 'view',
  template: '<canvas width="100" style="display: block" #view></canvas>'
})
export class ViewComponent {
  // @ts-ignore
  @ViewChild('view') view: ElementRef<HTMLCanvasElement>;
  // @ts-ignore
  renderer:THREE.WebGLRenderer;
  // @ts-ignore
  composer: EffectComposer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderScene: RenderPass;
  time: THREE.Clock;
  sphereSubdivs: number;
  sphereRad: number;
  offsetSphr: THREE.Spherical;
  offsetDir: THREE.Vector3;

  sphereGeometry: THREE.SphereGeometry;
  sphereMaterial: THREE.ShaderMaterial;
  sphereObject: THREE.Mesh;
  immersionGeometry: THREE.BufferGeometry;
  immersionPositionArr: Float32Array;
  immersionMaterial: THREE.PointsMaterial;
  immersionObject: THREE.Points;

  sphereClarity:number;
  sphereWidth:number;
  sphereDepth:number;
  sphereImmersion:number;

  constructor(public audio:AudioService, private sessionValues: SessionValuesService, private webGl: WebGlService, private shaderStore: ShadersService) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderScene = new RenderPass(this.scene, this.camera);
    this.time = new THREE.Clock();
    this.sphereSubdivs = 1024;
    this.sphereRad = 1.0;

    this.offsetSphr = new THREE.Spherical(1, Math.random() * Math.PI, Math.random() * Math.PI * 2);
    this.offsetDir = new THREE.Vector3();
    this.offsetDir.setFromSpherical(this.offsetSphr);

    this.sphereGeometry = this.initSphereGeometry();
    this.sphereMaterial = this.initSphereMaterial();
    this.sphereObject = this.generateSphere();

    this.immersionPositionArr = new Float32Array(5000 * 3);
    this.immersionGeometry = this.initImmersionGeometry();
    this.immersionMaterial = this.initImmersionMaterial();
    this.immersionObject = this.generateImmersion();

    this.sphereClarity = 0.0;
    this.sphereWidth = 1.0;
    this.sphereDepth = 1.0;
    this.sphereImmersion = 0.0;
  }

  ngOnInit() {
    THREE.Cache.enabled = true;
    this.time.start();

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
      this.scene.add(this.immersionObject);
      this.immersionObject.scale.set(5, 5, 5);
      this.scene.add(this.sphereObject);
      this.scene.fog = new THREE.FogExp2(0x11111f, 0.25);

      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(this.renderScene);
      let bloom = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1, 10, 0);
      this.composer.addPass(bloom);

      this.camera.position.set(0, 0, 3.5);
      let orbitControls = new OrbitControls(this.camera, this.renderer.domElement);

      let animate = () => {
        requestAnimationFrame(animate);
        //this.renderer.render(this.scene, this.camera);
        this.composer.render();
        this.updateGraphics();
      }
      animate();
    }
  }

  // create objects

  generateImmersion()
  {
    let points = new THREE.Points(this.immersionGeometry, this.immersionMaterial);
    return points;
  }

  generateSphere()
  {
    let mesh = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
    return mesh;
  }

  initImmersionGeometry()
  {
    let geometry = new THREE.BufferGeometry();
    for(let i = 0; i < this.immersionPositionArr.length; i++)
    {
      this.immersionPositionArr[i] = Math.random() - 0.5;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(this.immersionPositionArr, 3));
    return geometry;
  }

  initImmersionMaterial()
  {
    let material = new THREE.PointsMaterial(
      {
        size: 0.005,
        opacity: 0.75,
        transparent: true,
        color: 'red'
      }
    );
    return material;
  }

  initSphereGeometry()
  {
    let geometry = new THREE.SphereGeometry(this.sphereRad, this.sphereSubdivs, this.sphereSubdivs);
    geometry.computeTangents();
    return geometry;
  }

  initSphereMaterial()
  {
    let uniforms = THREE.UniformsUtils.merge([
      THREE.UniformsLib["fog"],
      THREE.UniformsLib[ "lights" ],
      {
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

    let sphereMaterial = new THREE.ShaderMaterial({
      lights:true,
      fog:true,
      uniforms: uniforms,
      defines: {
        USE_TANGENT: ''
      },
      vertexShader: this.shaderStore.vertexShader,
      fragmentShader: this.shaderStore.fragmentShader,
    });

    return sphereMaterial;
  }

  // utility functions

  initRenderer() {
    let renderer = new THREE.WebGLRenderer({
      canvas: this.view.nativeElement
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer = renderer;
  }

  updateGraphics()
  {
    this.audio.updateAnalyzerData();

    this.immersionObject.geometry.setAttribute('position',
      new THREE.BufferAttribute(this.immersionPositionArr.slice(0, this.sphereImmersion * 100 * 3), 3));
    this.immersionObject.rotateY(0.0002);
    this.immersionObject.rotateX(0.00015);

    this.sphereMaterial.uniforms['uTime'].value = this.time.getElapsedTime() * 0.8;
    this.sphereMaterial.uniforms['uDisplacementStrength'].value = this.sphereClarity + this.audio.analyzerLevel;
    this.sphereMaterial.uniforms['uWidth'].value = this.sphereWidth;
    this.sphereMaterial.uniforms['uDepth'].value = this.sphereDepth;
    this.sphereMaterial.uniforms['uAverageFrequency'].value = this.audio.analyser.getAverageFrequency();

    let t = this.time.getElapsedTime() * 25;
    this.offsetSphr.phi = ((Math.sin(t * 0.0056) * Math.sin(t * 0.0048)) * 0.5 + 0.5) * Math.PI;
    this.offsetSphr.theta = ((Math.sin(t * 0.0024) * Math.sin(t * 0.00152)) * 0.5 + 0.5) * Math.PI * 2;
    this.offsetDir.setFromSpherical(this.offsetSphr);
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
