import {Component, Input, OnInit} from '@angular/core';
import {WrapperBoolean} from '../classes/wrapper-boolean';
import {DateField} from '../classes/date-field';

@Component({
  selector: 'nab-date-field',
  templateUrl: './date-field.component.html',
  styleUrls: ['./date-field.component.scss']
})
export class DateFieldComponent implements OnInit {

  @Input() public datafieldObject: DateField;
  @Input() showLabel: WrapperBoolean;

  constructor() {
  }

  ngOnInit(): void {
  }

}
