import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Model} from '../classes/model';
import {ModelService} from '../model.service';

@Injectable({
  providedIn: 'root'
})
export class SimulationModeService {
  originalModel: BehaviorSubject<Model>;

  constructor(private modelService: ModelService) {
    this.originalModel = new BehaviorSubject(new Model());
  }

  modelClone() {
    if (this.modelService.model === undefined) {
      this.originalModel.next(new Model());
      this.modelService.model = this.originalModel.getValue().clone();
    } else {
      this.originalModel.next(this.modelService.model);
      this.modelService.model = this.originalModel.getValue().clone();
    }
  }

  modelOnDestroy() {
    this.modelService.model = this.originalModel.getValue();
  }
}
