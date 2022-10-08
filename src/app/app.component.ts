import {Component} from '@angular/core';
import {StringStoreService} from "./Services/string-store.service";
import {MatDialog} from "@angular/material/dialog";
import {WelcomeMenu} from "./Components/welcome-menu/welcome-menu.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  stringStore = new StringStoreService();

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.dialog.open(WelcomeMenu);
  }

  resetSession()
  {
    //add warning
    location.reload()
  }
}





