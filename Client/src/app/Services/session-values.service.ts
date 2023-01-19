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
  private sliderPauseSource:BehaviorSubject<boolean>;
  sliderPause:Observable<boolean>;
  private sliderPlaySource: BehaviorSubject<boolean>;
  sliderPlay:Observable<boolean>;
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

  numRounds:number = NUM_ROUNDS;
  currRound:number = 0;

  isDarkMode:boolean = false;

  constructor(private audio: AudioService, private client: HttpClient, public stringStore: StringStoreService, private dialog: MatDialog) {
    this.activateDarkMode();

    this.sliderResetSource = new BehaviorSubject<boolean>(false);
    this.sliderReset = this.sliderResetSource.asObservable();

    this.sliderPauseSource = new BehaviorSubject<boolean>(false);
    this.sliderPause = this.sliderPauseSource.asObservable();

    this.sliderPlaySource = new BehaviorSubject<boolean>(false);
    this.sliderPlay = this.sliderPlaySource.asObservable();

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

  pauseAnimation()
  {
    this.sliderPauseSource.next(true);
    this.sliderPauseSource.next(false);
  }

  resumeAnimation()
  {
    this.sliderPlaySource.next(true);
    this.sliderPlaySource.next(false);
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

  activateDarkMode()
  {
    // @ts-ignore
    let bglight = getComputedStyle(document.querySelector(':root')).getPropertyValue('--light');

    // @ts-ignore
    let textlight = getComputedStyle(document.querySelector(':root')).getPropertyValue('--primary4');

    // @ts-ignore
    let bgdark1 = getComputedStyle(document.querySelector(':root')).getPropertyValue('--dark1');

    // @ts-ignore
    let bgdark2 = getComputedStyle(document.querySelector(':root')).getPropertyValue('--dark2');

    if(this.isDarkMode)
    {
      // @ts-ignore
      document.querySelector(':root').style.setProperty('--background1', bglight);
      // @ts-ignore
      document.querySelector(':root').style.setProperty('--background2', bglight);
      // @ts-ignore
      document.querySelector(':root').style.setProperty('--text1', bgdark1);
      // @ts-ignore
      document.querySelector(':root').style.setProperty('--text2', textlight);
      // @ts-ignore
      document.querySelector(':root').style.setProperty('--text3', '#000000');
      this.isDarkMode = false;
    }
    else {
      // @ts-ignore
      document.querySelector(':root').style.setProperty('--background1', bgdark1);
      // @ts-ignore
      document.querySelector(':root').style.setProperty('--background2', bgdark2);
      // @ts-ignore
      document.querySelector(':root').style.setProperty('--text1', bglight);
      // @ts-ignore
      document.querySelector(':root').style.setProperty('--text2', bgdark1);
      // @ts-ignore
      document.querySelector(':root').style.setProperty('--text3', bglight);

      this.isDarkMode = true;
    }
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
