import {Component, OnInit} from '@angular/core';
import {Model} from '../../modeler/classes/model';
import {Transition} from '../../modeler/classes/transition';
import {ModelService} from '../../modeler/model.service';
import {Router} from '@angular/router';

@Component({
  selector: 'nab-info-label',
  templateUrl: './info-label.component.html',
  styleUrls: ['./info-label.component.scss']
})
export class InfoLabelComponent implements OnInit {

  models: Model[];
  transitions: Transition[];
  selectedTransition: Transition;

  constructor(private modelService: ModelService, private router: Router) {
    const id = localStorage.getItem('TransitionId');
    if (id !== null) {
      this.selectedTransition = this.modelService.model.transitions.find((item) => item.id === id);
    }
  }

  ngOnInit(): void {
  }

  redirect() {
    this.router.navigate(['']);
  }
}
