import {Component, OnInit} from '@angular/core';
import {AssignPolicy, FinishPolicy, Transition} from '../../../classes/transition';
import {ModelService} from '../../../model.service';

@Component({
  selector: 'nab-dialog-transition-settings',
  templateUrl: './dialog-transition-settings.component.html',
  styleUrls: ['./dialog-transition-settings.component.scss']
})
export class DialogTransitionSettingsComponent implements OnInit {
  transition: Transition;
  assignPolicyOptions: AssignPolicy[];
  finishPolicyOptions: FinishPolicy[];

  constructor(private modelService: ModelService) { }

  ngOnInit(): void {
    this.transition = this.modelService.model.transitions.find(item => item.id === localStorage.getItem('TransitionId'));
    this.assignPolicyOptions = [AssignPolicy.manual, AssignPolicy.auto];
    this.finishPolicyOptions = [FinishPolicy.manual, FinishPolicy.autoNoData];
  }
}
