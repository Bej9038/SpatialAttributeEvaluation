import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  ngOnInit()
  {
    if(this.isWebGlAvailable())
    {

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


