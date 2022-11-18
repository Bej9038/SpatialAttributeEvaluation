import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SessionValuesService {

  private claritySource = new BehaviorSubject<number>(5.0);
  clarity = this.claritySource.asObservable();

  private widthSource = new BehaviorSubject<number>(1.0);
  width = this.widthSource.asObservable();

  private depthSource = new BehaviorSubject<number>(1.0);
  depth = this.depthSource.asObservable();

  private immersionSource = new BehaviorSubject<number>(1.0);
  immersion = this.immersionSource.asObservable();

  private usernameSource = new BehaviorSubject<string>("");
  username = this.usernameSource.asObservable();

  updateClarity(clarity: number)
  {
    this.claritySource.next(clarity);
  }

  updateWidth(width: number)
  {
    this.widthSource.next(width);
  }

  updateDepth(depth: number)
  {
    this.depthSource.next(depth);
  }

  updateImmersion(immersion: number)
  {
    this.immersionSource.next(immersion);
  }

  updateUsername(username: string)
  {
    this.usernameSource.next(username);
  }
}
