import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringStoreService {
  immersionAttributeDescription: string =
    "The apparent magnitude of impression that the sound field is enveloping and immersing the listener.";
  clarityAttributeDescription: string =
    "The clear integration of various sound components in their spatial images.";
  widthAttributeDescription: string =
    "The apparent horizontal spatial extent of the sound image.";
  depthAttributeDescription: string =
    "The apparent distance between the front and the back of the sound image.";
  endSessionWarning: string =
    "Are you sure you'd like to end the current session?";
  directions: string =
    "\n- In this test, you will hear a series of songs" +
    "\n\n- Use the controls on the right to characterize each song" +
    "\n\n- Press \"Next Song\" to finalize your decision" +
    "\nand move onto the next song";
  serverUri:string = "http://rosie:80/";
}
