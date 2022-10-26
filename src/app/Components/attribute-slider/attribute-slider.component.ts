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
      this.sliderValues.updateClarity(event.value + 5);
    }
  }
}
