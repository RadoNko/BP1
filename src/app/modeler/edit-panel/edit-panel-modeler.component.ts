import {Component, Input, OnInit} from '@angular/core';
import {Transition} from '../classes/transition';
import {CanvasService} from '../canvas.service';
import {ModelService} from '../model.service';
import {Trigger} from '../classes/trigger';
import {MatSidenav} from '@angular/material/sidenav';

export interface Select {
  key: string;
  value: string;
}

@Component({
  selector: 'nab-edit-panel-modeler',
  templateUrl: './edit-panel-modeler.component.html',
  styleUrls: ['./edit-panel-modeler.component.scss']
})
export class EditPanelModelerComponent implements OnInit {
  @Input() nav: MatSidenav;
  optionsAssign: Select[];
  optionsFinish: Select[];
  transition: Transition;

  constructor(private canvasService: CanvasService, private modelService: ModelService) {
    this.optionsAssign = [{key: 'manual', value: 'Manual'}, {key: 'auto', value: 'Auto'}];
    this.optionsFinish = [{key: 'manual', value: 'Manual'}, {key: 'auto_no_data', value: 'Auto no data'}];
  }

  ngOnInit(): void {
    this.canvasService.selectedTransition.subscribe(obj => this.transition = obj);
  }

  onChange($event, value: string) {
    switch (value) {
      case 'label':
        this.modelService.model.transitions.find(item => item.id === this.transition.id).label = $event.target.value;
        break;
      case 'icon':
        this.modelService.model.transitions.find(item => item.id === this.transition.id).icon = $event.target.value;
        break;
      case 'assign':
        this.modelService.model.transitions.find(item => item.id === this.transition.id).assignPolicy = $event.target.value;
        break;
      case 'finish':
        this.modelService.model.transitions.find(item => item.id === this.transition.id).finishPolicy = $event.target.value;
        break;
    }
  }

  saveTriggers(triggers: Trigger[]) {
    this.transition.triggers = [...triggers];
  }
}
