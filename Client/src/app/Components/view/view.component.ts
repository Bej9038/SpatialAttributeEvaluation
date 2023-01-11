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
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {ModelsService} from "./models.service";

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
  // @ts-ignore
  sphereGeometry: THREE.SphereGeometry;
  // @ts-ignore
  sphereMaterial: THREE.ShaderMaterial;
  // @ts-ignore
  sphereObject: THREE.Mesh;

  offsetSphr: THREE.Spherical;
  offsetDir: THREE.Vector3;
  sphereSubdivs: number = 1024;
  sphereRad: number = 1.0;
  sphereClarity:number = 0.0;
  sphereWidth:number = 1.0;
  sphereDepth:number = 1.0;
  sphereImmersion:number = 0.0;

  constructor(public models:ModelsService, public audio:AudioService, private sessionValues: SessionValuesService, private webGl: WebGlService, private shaderStore: ShadersService) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderScene = new RenderPass(this.scene, this.camera);
    this.time = new THREE.Clock();
    this.bloomLayer = new THREE.Layers();
    this.offsetSphr = new THREE.Spherical(1, Math.random() * Math.PI, Math.random() * Math.PI * 2);
    this.offsetDir = new THREE.Vector3();
  }

  ngOnInit() {
    THREE.Cache.enabled = true;
    this.time.start();
    this.offsetDir.setFromSpherical(this.offsetSphr);
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
      this.initOrbitControls();

      this.models.generateImmersion();
      this.scene.add(this.models.getImmersionObject());

      this.sphereGeometry = this.initSphereGeometry();
      this.sphereMaterial = this.initSphereMaterial();
      this.sphereObject = this.generateSphere();

      this.scene.add(this.sphereObject);

      //this.scene.fog = new THREE.FogExp2(0x11111f, 0.25);
      //this.scene.add( new THREE.AmbientLight( 0x404040 ) );

      this.camera.position.set(0, 0, 3.5);

      let animate = () => {
        requestAnimationFrame(animate);
        //this.renderer.render(this.scene, this.camera);
        this.bloomComposer.render();
        this.updateGraphics();
      }
      animate();
    }
  }

  // create objects



  generateSphere()
  {
    let mesh = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
    return mesh;
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
        baseTexture: { value: null },
        bloomTexture: { value: this.bloomComposer.renderTarget2.texture },
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

    let finalpass = new ShaderPass(this.sphereMaterial, 'baseTexture');
    finalpass.needsSwap = true;
    this.finalComposer.addPass(this.renderScene);
    this.finalComposer.addPass(finalpass);
  }

  initOrbitControls()
  {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableZoom = false;
    // this.controls.minDistance = 1;
    // this.controls.maxDistance = 10;
  }

  updateGraphics()
  {
    this.audio.updateAnalyzerData();

    this.models.getImmersionObject().geometry.setAttribute('position',
      new THREE.BufferAttribute(this.models.immersionPositionArr.slice(0, this.sphereImmersion * 100 * 3), 3));
    this.models.getImmersionObject().rotateY(0.0002);
    this.models.getImmersionObject().rotateX(0.00015);

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
