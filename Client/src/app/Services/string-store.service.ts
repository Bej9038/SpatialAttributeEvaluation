import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringStoreService {
  immersionAttributeDescription:string =
    "The apparent magnitude of impression that the sound field is enveloping and immersing the listener.";
  clarityAttributeDescription:string =
    "The clear integration of various sound components in their spatial images.";
  widthAttributeDescription:string =
    "The apparent horizontal spatial extent of the sound image.";
  depthAttributeDescription:string =
    "The apparent distance between the front and the back of the sound image.";
  endSessionWarning:string =
    "Are you sure you'd like to end the current session?";
  serverUri:string = "http://localhost:8080/";
}
