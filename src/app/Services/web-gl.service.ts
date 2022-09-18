import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebGlService {

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
