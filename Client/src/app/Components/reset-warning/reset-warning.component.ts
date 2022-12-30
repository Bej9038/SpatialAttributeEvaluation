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

  constructor(public sessionValues:SessionValuesService, public stringStore:StringStoreService) {}

}
