import { Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {SessionValuesService} from "../../Services/session-values.service";

@Component({
  selector: 'welcome-menu',
  templateUrl: './welcome-menu.component.html',
  styleUrls: ['./welcome-menu.component.css']
})
export class WelcomeMenu {
  formIsValid:boolean = true;
  userName:string = ""
  invalidName:boolean = false;

  constructor(private sliderValues: SessionValuesService) {
  }

  updateUsername(username: string)
  {
    this.sliderValues.updateUsername(username);
  }
}
