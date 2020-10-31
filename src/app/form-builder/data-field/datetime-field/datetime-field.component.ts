import {Component, Input, OnInit} from '@angular/core';
import {WrapperBoolean} from '../classes/wrapper-boolean';
import {DatetimeField} from '../classes/datetime-field';
import {DATE_TIME_FORMAT} from './time-formats';
import {NGX_MAT_DATE_FORMATS} from '@angular-material-components/datetime-picker';

@Component({
  selector: 'nab-datetime-field',
  templateUrl: './datetime-field.component.html',
  styleUrls: ['./datetime-field.component.scss'],
  providers: [
    {provide: NGX_MAT_DATE_FORMATS, useValue: DATE_TIME_FORMAT}
  ]
})
export class DatetimeFieldComponent implements OnInit {
  @Input() public datafieldObject: DatetimeField;
  @Input() showLabel: WrapperBoolean;

  constructor() {
  }

  ngOnInit(): void {
  }

}
