import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import { ScriptService } from "../../Services/script.service";
import * as THREE from "three";

@Component({
  selector: 'view',
  template: '<canvas #view></canvas>',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {
  // @ts-ignore
  @ViewChild('view') view: ElementRef<HTMLCanvasElement>;
  private script:ScriptService = new ScriptService();

  ngAfterViewInit()
  {
    if(this.isWebGlAvailable())
    {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
      const renderer = new THREE.WebGLRenderer({
        canvas: this.view.nativeElement
      });
      renderer.setSize( window.innerWidth, window.innerHeight );
      const geometry = new THREE.BoxGeometry( 1, 1, 1 );
      const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      const cube = new THREE.Mesh( geometry, material );
      scene.add( cube );
      renderer.render(scene, camera);

      this.script.load('filepicker', 'rangeSlider').then(data => {
        console.log('script loaded ', data);
      }).catch(error => console.log(error));
    }
  }


  isWebGlAvailable()
  {
    if (this.attemptWebGl()) {
      return true;
    } else {
      //display error message
      return false;
    }
  }

  attemptWebGl()
  {
    try {
      const canvas = document.createElement( 'canvas' );
      return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) );
    } catch ( e ) {
      return false;
    }
  }
}
