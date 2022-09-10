import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSliderModule } from '@angular/material/slider';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AttributeSlider} from "./Components/attribute-slider.component";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatListModule} from "@angular/material/list";

@NgModule({
  declarations: [
    AppComponent,
    AttributeSlider
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatGridListModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
