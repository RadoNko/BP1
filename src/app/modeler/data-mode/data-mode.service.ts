import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {DataVariable} from '../classes/data-variable';

@Injectable({
  providedIn: 'root'
})
export class DataModeService {
  event: EventEmitter<void>;
  itemData: BehaviorSubject<DataVariable>;

  constructor() {
    this.event = new EventEmitter();
    this.itemData = new BehaviorSubject<DataVariable>(new DataVariable('first'));
  }
}
