import {Component} from '@angular/core';
import {StringStoreService} from "./Services/string-store.service";
import {WelcomeMenu} from "./Components/welcome-menu/welcome-menu.component";
import {MatDialog} from "@angular/material/dialog";

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
        exitAnimationDuration: '.8s',
        enterAnimationDuration: '.4s',
        width: '400px',
        height: '340px',
        autoFocus: false
      });
  }
}





