import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SliderValuesService {

  private claritySource = new BehaviorSubject<number>(5);
  clarity = this.claritySource.asObservable();

  updateClarity(clarity: number)
  {
    this.claritySource.next(clarity);
  }
}
