import {Component} from '@angular/core';
import {StringStoreService} from "./Services/string-store.service";
import {MatDialog} from "@angular/material/dialog";
import {WelcomeMenu} from "./Components/welcome-menu/welcome-menu.component";
import {ResetWarning} from "./Components/reset-warning/reset-warning.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  stringStore = new StringStoreService();
  userName:string = ""

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.dialog.open(WelcomeMenu,
      {
        enterAnimationDuration: '.5s',
        width: '400px',
        height: '400px',
        autoFocus: false
      });
  }

  endSession()
  {
    let dialogRef = this.dialog.open(ResetWarning,
      {
        enterAnimationDuration: '.5s',
        autoFocus: false
      });
  }
}





