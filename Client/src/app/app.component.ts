import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {StringStoreService} from "./Services/string-store.service";
import {WelcomeMenu} from "./Components/welcome-menu/welcome-menu.component";
import {MatDialog} from "@angular/material/dialog";
import {SessionValuesService} from "./Services/session-values.service";
import {AudioService} from "./Services/audio.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // @ts-ignore
  @ViewChild('slidergrid') slidergrid: ElementRef<HTMLDivElement>;
  userName:string;

  constructor(public audio: AudioService, private dialog: MatDialog, public stringStore: StringStoreService, public sessionValues: SessionValuesService)
  {
    this.userName = "";
  }

  ngOnInit() {
    this.dialog.open(WelcomeMenu,
      {
        exitAnimationDuration: '.8s',
        enterAnimationDuration: '.4s',
        width: '400px',
        height: '340px',
        autoFocus: false,
        disableClose: true
      });
  }

  ngOnViewInit()
  {
    this.onResize();
  }

  volSlider(event:any)
  {
    this.audio.setVolume(event.value/100);
  }

  @HostListener('window:keyup.space', ['$event'])
  playButton()
  {
    if(this.audio.dest.isPlaying)
    {
      this.audio.pause();
      this.sessionValues.pauseAnimation();
    }
    else
    {
      this.audio.play();
      this.sessionValues.resumeAnimation();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    // if(window.innerWidth < 1100)
    // {
    //   // @ts-ignore
    //   this.slidergrid.nativeElement.style.setProperty('grid-template-columns', 'repeat(1, 1fr)');
    // }
    // else
    // {
    //   // @ts-ignore
    //   this.slidergrid.nativeElement.style.setProperty('grid-template-columns', 'repeat(2, 1fr)');
    // }
  }
}





