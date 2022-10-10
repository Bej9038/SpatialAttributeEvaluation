import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSliderModule } from '@angular/material/slider';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AttributeSlider } from "./Components/attribute-slider/attribute-slider.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatListModule } from "@angular/material/list";
import { ViewComponent } from './Components/view/view.component';
import { MatToolbarModule} from "@angular/material/toolbar";
import { MatTooltipModule} from "@angular/material/tooltip";
import { WelcomeMenu } from './Components/welcome-menu/welcome-menu.component';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { A11yModule} from '@angular/cdk/a11y';
import { ResetWarning } from './Components/reset-warning/reset-warning.component';
import { FormsModule } from "@angular/forms";
import { Toolbar } from './Components/toolbar/toolbar.component';

@NgModule({
  declarations: [
    AppComponent,
    AttributeSlider,
    ViewComponent,
    WelcomeMenu,
    ResetWarning,
    Toolbar
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatSliderModule,
        MatGridListModule,
        MatListModule,
        MatToolbarModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatCardModule,
        MatInputModule,
        MatDialogModule,
        MatButtonModule,
        A11yModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
