import { Component, OnInit } from '@angular/core';
import {StringStoreService} from "../../Services/string-store.service";
import {SessionValuesService} from "../../Services/session-values.service";
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'app-reset-warning',
  templateUrl: './reset-warning.component.html',
  styleUrls: ['./reset-warning.component.css']
})
export class ResetWarning{


  constructor(private client: HttpClient, public stringStore: StringStoreService, private sliderValues: SessionValuesService) {}

  resetSession() {
    let request = this.client.get(this.stringStore.serverUri);
    console.log("test");
    request.subscribe(data => console.log(data));
    //location.reload()
  }
}
