import {Component} from '@angular/core';
import {StringStoreService} from "./Services/string-store.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  stringStore = new StringStoreService();
}





