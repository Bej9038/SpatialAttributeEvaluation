import { Component, Input} from '@angular/core';

@Component({
  selector: 'attribute-slider',
  templateUrl: './attribute-slider.component.html',
  styleUrls: ['./attribute-slider.component.css'],
})
export class AttributeSlider {
  @Input() attributeName: string = "";
  value:number = 0;

  constructor() {
  }

  updateValue()
  {

  }
}
