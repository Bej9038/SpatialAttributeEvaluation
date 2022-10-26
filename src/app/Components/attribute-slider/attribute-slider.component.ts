import {Component, Input} from '@angular/core';
import {SliderValuesService} from "../../Services/slider-values.service";

@Component({
  selector: 'attribute-slider',
  templateUrl: './attribute-slider.component.html',
  styleUrls: ['./attribute-slider.component.css'],
})
export class AttributeSlider {
  @Input() attributeName: string = "";

  constructor(private sliderValues: SliderValuesService) {
  }

  emitValue(event:any)
  {
    if(this.attributeName == "Clarity")
    {
      this.sliderValues.updateClarity(event.value/3 + 5);
    }
    else if(this.attributeName == "Width")
    {
      this.sliderValues.updateWidth(event.value/100 + 1);
    }
    else if(this.attributeName == "Depth")
    {
      this.sliderValues.updateDepth(event.value/100 + 1);
    }
    else if(this.attributeName == "Immersion")
    {
      this.sliderValues.updateImmersion(event.value/100 + 1);
    }
  }
}
