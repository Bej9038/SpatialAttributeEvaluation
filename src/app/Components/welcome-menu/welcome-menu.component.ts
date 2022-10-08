import { Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'welcome-menu',
  templateUrl: './welcome-menu.component.html',
  styleUrls: ['./welcome-menu.component.css']
})
export class WelcomeMenu {
  formIsValid:boolean = true;
}
