import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

const NUM_ROUNDS = 10;

@Injectable({
  providedIn: 'root'
})
export class SessionValuesService {
  private claritySource:BehaviorSubject<number>;
  clarity:Observable<number>;
  private widthSource:BehaviorSubject<number>;
  width:Observable<number>;

  private depthSource:BehaviorSubject<number>;
  depth:Observable<number>;

  private immersionSource:BehaviorSubject<number>;
  immersion:Observable<number>;

  private usernameSource:BehaviorSubject<string>;
  username:Observable<string>;

  numRounds:number;
  currRound:number;

  constructor() {
    this.claritySource = new BehaviorSubject<number>(0.06);
    this.clarity = this.claritySource.asObservable();

    this.widthSource = new BehaviorSubject<number>(1.0);
    this.width = this.widthSource.asObservable();

    this.depthSource = new BehaviorSubject<number>(1.0);
    this.depth = this.depthSource.asObservable();

    this.immersionSource = new BehaviorSubject<number>(1.0);
    this.immersion = this.immersionSource.asObservable();

    this.usernameSource = new BehaviorSubject<string>("");
    this.username = this.usernameSource.asObservable();

    this.numRounds = NUM_ROUNDS;
    this.currRound = 0;
  }

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
