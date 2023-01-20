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

  @HostListener('window:keydown.Enter', ['$event'])
  onEnter()
  {
    this.showDirections ? this.closeDialog() : this.openDirections();
  }

  openDirections()
  {
    this.usernameValidator.markAsTouched();
    if(this.usernameValidator.valid)
    {
      this.updateUsername();
      this.showDirections = true;
    }
  }

  closeDialog()
  {
    this.audio.initAudioService();
    console.log("close");
    this.dialogRef.close();
  }
}
