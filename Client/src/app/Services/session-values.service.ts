import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {StringStoreService} from "./string-store.service";
import {MatDialog} from "@angular/material/dialog";
import {SubmissionDialog} from "../Components/submission-dialog/submission-dialog.component";
import {AudioService} from "./audio.service";

const NUM_ROUNDS = 10;

@Injectable({
  providedIn: 'root'
})
export class SessionValuesService {
  private sliderResetSource: BehaviorSubject<boolean>;
  sliderReset:Observable<boolean>;
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

  constructor(private audio: AudioService, private client: HttpClient, public stringStore: StringStoreService, private dialog: MatDialog) {
    this.sliderResetSource = new BehaviorSubject<boolean>(false);
    this.sliderReset = this.sliderResetSource.asObservable();

    this.claritySource = new BehaviorSubject<number>(0.0);
    this.clarity = this.claritySource.asObservable();

    this.widthSource = new BehaviorSubject<number>(1.0);
    this.width = this.widthSource.asObservable();

    this.depthSource = new BehaviorSubject<number>(1.0);
    this.depth = this.depthSource.asObservable();

    this.immersionSource = new BehaviorSubject<number>(0.0);
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

  nextSong()
  {
    if(this.currRound/this.numRounds == 100)
    {
      this.resetSession();
    }
    else
    {
      this.audio.stop();
    }
    this.sliderResetSource.next(true);
    this.sliderResetSource.next(false);
    setTimeout(()=>{
      this.currRound += 100;
    }, 850);
  }

  resetSession() {
    this.audio.stop();
    this.dialog.open(SubmissionDialog,
      {
        exitAnimationDuration: '.8s',
        enterAnimationDuration: '.4s',
        width: '400px',
        height: '340px',
        autoFocus: false,
        disableClose: true
      });

    setTimeout(function(){
      location.reload();
    }, 3000);

    // let request = this.client.get(this.stringStore.serverUri,
    //   {responseType: 'text'});
    // request.subscribe(data => console.log(data));
  }
}
