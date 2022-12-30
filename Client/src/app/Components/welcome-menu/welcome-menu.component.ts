import {Component, HostListener} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {SessionValuesService} from "../../Services/session-values.service";
import {FormControl, Validators} from "@angular/forms";
import {AudioService} from "../../Services/audio.service";
import {StringStoreService} from "../../Services/string-store.service";

@Component({
  selector: 'welcome-menu',
  templateUrl: './welcome-menu.component.html',
  styleUrls: ['./welcome-menu.component.css']
})
export class WelcomeMenu {
  usernameValidator: FormControl;
  input:string;
  showDirections:boolean;

  constructor(private audio: AudioService, public stringStore: StringStoreService,
              private sessionValues: SessionValuesService, private dialogRef: MatDialogRef<WelcomeMenu>) {
    this.usernameValidator = new FormControl('', [Validators.required,
      Validators.maxLength(25)]);
    this.input = "";
    this.showDirections = false;
  }

  updateUsername()
  {
    this.sessionValues.updateUsername(this.input);
  }

  @HostListener('window:keyup.Enter', ['$event'])
  openDirections()
  {
    this.usernameValidator.markAsTouched();
    if(this.usernameValidator.valid)
    {
      this.updateUsername();
      this.showDirections = true;
      this.audio.loadAudio("../assets/Audio/jazz.mp3");
    }
  }

  @HostListener('window:keyup.Enter', ['$event'])
  closeDialog()
  {
    this.dialogRef.close();
    this.sessionValues.currRound += 100;
    this.audio.play();
  }
}
