import {Component, ElementRef, inject, Input, ViewChild} from '@angular/core';
import {WebGlService} from "../../Services/web-gl.service";
import * as THREE from "three";
import { gsap } from "gsap";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

@Component({
  selector: 'view',
  template: '<canvas width="100"  #view></canvas>',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {
  // @ts-ignore
  @ViewChild('view') view: ElementRef<HTMLCanvasElement>;
  private webGl: WebGlService = new WebGlService();
  private scene: THREE.Scene = new THREE.Scene();
  private camera:THREE.PerspectiveCamera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
  // @ts-ignore
  private renderer:THREE.WebGLRenderer;

  ngAfterViewInit()
  {
    if(!this.webGl.isWebGlAvailable()) {
      window.alert("error, webGL not available");
    }
    else {

      this.initRenderer();
      window.addEventListener("resize", this.onWindowResize)

      let particles = this.createParticles();

      let renderingParent = new THREE.Group();
      renderingParent.add(particles);

      // let resizeContainer = new THREE.Group();
      // resizeContainer.add(renderingParent);
      this.scene.add(renderingParent);

      this.camera.position.z = 350;

      let gridHelper = new THREE.GridHelper(1000, 50);
      let orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
      this.scene.add(gridHelper);

      let animate = () => {
        requestAnimationFrame(animate);
        this.renderer.render(this.scene, this.camera);
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

  createParticles() {
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
