import { Component, OnInit } from '@angular/core';
import {AudioService} from "../../Services/audio.service";
import {StringStoreService} from "../../Services/string-store.service";
import {SessionValuesService} from "../../Services/session-values.service";
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'submission-dialog',
  templateUrl: './submission-dialog.component.html',
  styleUrls: ['./submission-dialog.component.css']
})
export class SubmissionDialog implements OnInit {

  constructor(private audio: AudioService, public stringStore: StringStoreService,
              private sessionValues: SessionValuesService, private dialogRef: MatDialogRef<SubmissionDialog>) {

  }

  ngOnInit(): void {
  }

}
