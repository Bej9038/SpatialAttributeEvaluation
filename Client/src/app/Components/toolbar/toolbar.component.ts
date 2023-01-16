import { Component, OnInit } from '@angular/core';
import {ResetWarning} from "../reset-warning/reset-warning.component";
import {MatDialog} from "@angular/material/dialog";
@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class Toolbar{

  constructor(public dialog: MatDialog) {}

  endSession()
  {
    this.dialog.open(ResetWarning,
      {
        exitAnimationDuration: '.4s',
        enterAnimationDuration: '.4s',
        height: '160px',
        autoFocus: false
      });
  }
}
