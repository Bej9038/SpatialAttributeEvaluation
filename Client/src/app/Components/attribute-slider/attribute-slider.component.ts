import {Component, Input} from '@angular/core';
import {SessionValuesService} from "../../Services/session-values.service";

@Component({
  selector: 'attribute-slider',
  templateUrl: './attribute-slider.component.html',
  styleUrls: ['./attribute-slider.component.css'],
})
export class AttributeSlider {
  @Input() attributeName: string = "";

  constructor(private sessionValues: SessionValuesService) {
  }

  emitValue(event:any)
  {
    if(this.attributeName == "Clarity")
    {
      this.sessionValues.updateClarity(event.value/200 + .06);
    }
    else if(this.attributeName == "Width")
    {
      this.sessionValues.updateWidth(event.value/100 + 1);
    }
    else if(this.attributeName == "Depth")
    {
      this.sessionValues.updateDepth(event.value/100 + 1);
    }
    else if(this.attributeName == "Immersion")
    {
      this.sessionValues.updateImmersion(event.value/100 + 1);
    }
  }
}
