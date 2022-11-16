import {Component, HostListener, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {SessionValuesService} from "../../Services/session-values.service";

@Component({
  selector: 'welcome-menu',
  templateUrl: './welcome-menu.component.html',
  styleUrls: ['./welcome-menu.component.css']
})
export class WelcomeMenu {
  formIsValid:boolean = true;
  invalidName:boolean = false;
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
    this.updateUsername();
    this.dialogRef.close();
  }
}
