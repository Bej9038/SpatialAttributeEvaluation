import { Component, OnInit } from '@angular/core';
import {StringStoreService} from "../../Services/string-store.service";

@Component({
  selector: 'app-reset-warning',
  templateUrl: './reset-warning.component.html',
  styleUrls: ['./reset-warning.component.css']
})
export class ResetWarning{


  constructor(public stringStore: StringStoreService) {}

  ngOnInit(): void {
  }

  resetSession() {
    location.reload()
  }
}
