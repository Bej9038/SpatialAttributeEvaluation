import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {WebGlService} from "../../Services/web-gl.service";
import * as THREE from "three";
import { gsap } from "gsap";

@Component({
  selector: 'view',
  template: '<canvas #view></canvas>',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {
  // @ts-ignore
  @ViewChild('view') view: ElementRef<HTMLCanvasElement>;
  private webGl: WebGlService = new WebGlService();

  ngAfterViewInit()
  {
    if(this.webGl.isWebGlAvailable())
    {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
      const renderer = new THREE.WebGLRenderer({
        canvas: this.view.nativeElement
      });
      renderer.setSize( window.innerWidth, window.innerHeight );

      window.addEventListener("resize", function ()
      {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
      })

      let distance = Math.min(200, window.innerWidth / 4);
      let geometry = new THREE.BufferGeometry();
      let points = [];

      for(let i = 0; i < 1600; i++)
      {
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

      let particles = new THREE.Points(geometry, new THREE.PointsMaterial(
        {color: 0xff44ff, size: 2}
      ));
      let renderingParent = new THREE.Group();
      renderingParent.add(particles);

      let resizeContainer = new THREE.Group();
      resizeContainer.add(renderingParent);
      scene.add(resizeContainer);

      camera.position.z = 400;

      var animate = function ()
      {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      }

      animate();
      let animProps = {scale: 1, xRot: 0, yRot: 0};
      gsap.to(animProps, {duration: 10, scale: 1.3, repeat: -1, yoyo:true, ease: "sine", onUpdate: function (){
        renderingParent.scale.set(animProps.scale, animProps.scale, animProps.scale);
        }});
      gsap.to(animProps, {duration: 120, xRot: Math.PI * 2, yRot: Math.PI * 4, repeat: -1, yoyo:true, ease: "none", onUpdate: function (){
          renderingParent.rotation.set(animProps.scale, animProps.scale, animProps.scale);
        }})
    }
  }
}
