import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {SessionValuesService} from "../../Services/session-values.service";
import {MatSlider} from "@angular/material/slider";

@Component({
  selector: 'attribute-slider',
  templateUrl: './attribute-slider.component.html',
  styleUrls: ['./attribute-slider.component.css'],
})
export class AttributeSlider {
  @Input() attributeName: string;
  value:number;

  constructor(private sessionValues: SessionValuesService) {
    this.attributeName = "";
    this.value = 0;
  }

  ngAfterViewInit(){
    this.sessionValues.sliderReset.subscribe(sliderReset => {
      if(sliderReset)
      {
        this.decrement(this.value, 100/this.value);
      }
    });
  }

  decrement(val:number, decrementTime:number)
  {
    if(val > 0)
    {
      this.emitValue(val);
      val -= 1;
      this.value--;
      setTimeout(()=>{
        this.decrement(val, decrementTime);
      }, decrementTime);
    }
  }

  emitValue(value:number, event?:any)
  {
    if(event)
    {
      value = event.value;
    }

    if(this.attributeName == "Clarity")
    {
      this.sessionValues.updateClarity(value/200 + .06);
    }
    else if(this.attributeName == "Width")
    {
      this.sessionValues.updateWidth(value/100 + 1);
    }
    else if(this.attributeName == "Depth")
    {
      this.sessionValues.updateDepth(value/100 + 1);
    }
    else if(this.attributeName == "Immersion")
    {
      this.sessionValues.updateImmersion(value/100 + 1);
    }
  }
}
