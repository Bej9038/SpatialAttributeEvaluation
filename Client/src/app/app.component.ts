import {Component, HostListener} from '@angular/core';
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
  userName:string;

  constructor(public audio: AudioService, private dialog: MatDialog, public stringStore: StringStoreService, public sessionValues: SessionValuesService)
  {
    this.userName = "";
  }

  ngOnInit() {
    // this.dialog.open(WelcomeMenu,
    //   {
    //     exitAnimationDuration: '.8s',
    //     enterAnimationDuration: '.4s',
    //     width: '400px',
    //     height: '340px',
    //     autoFocus: false,
    //     disableClose: true
    //   });
  }

  volSlider(event:any)
  {
    this.audio.setVolume(event.value/100);
  }

  @HostListener('window:keyup.space', ['$event'])
  playButton()
  {
    this.audio.dest.isPlaying? this.audio.pause() : this.audio.play()
  }
}





