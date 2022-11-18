import {Component, HostListener, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {SessionValuesService} from "../../Services/session-values.service";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'welcome-menu',
  templateUrl: './welcome-menu.component.html',
  styleUrls: ['./welcome-menu.component.css']
})
export class WelcomeMenu {
  usernameValidator: FormControl = new FormControl('', [Validators.required,
    Validators.maxLength(25),
    Validators.pattern('[a-zA-Z]*')]);
  input:string = "";

  constructor(private sliderValues: SessionValuesService, private dialogRef: MatDialogRef<WelcomeMenu>) {
  }

  updateUsername()
  {
    this.sliderValues.updateUsername(this.input);
  }

  @HostListener('window:keyup.Enter', ['$event'])
  closeDialog()
  {
    if(this.usernameValidator.valid)
    {
      this.updateUsername();
      this.dialogRef.close();
    }
  }
}
