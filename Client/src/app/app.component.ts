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
  userName:string = ""

  constructor(private audio: AudioService, public dialog: MatDialog, public stringStore: StringStoreService) {}

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

    this.audio.loadAudio("../assets/Audio/jazz.mp3");
  }

  playAudio()
  {
    this.audio.play();
  }

}





