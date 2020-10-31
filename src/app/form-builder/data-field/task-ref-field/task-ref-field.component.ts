import {Component, Input, OnInit} from '@angular/core';
import {WrapperBoolean} from '../classes/wrapper-boolean';
import {TaskRefField} from '../classes/task-ref-field';

@Component({
  selector: 'nab-task-ref-field',
  templateUrl: './task-ref-field.component.html',
  styleUrls: ['./task-ref-field.component.scss']
})
export class TaskRefFieldComponent implements OnInit {
  @Input() datafieldObject: TaskRefField;
  @Input() showLabel: WrapperBoolean;

  constructor() {
  }

  ngOnInit(): void {
  }

}
