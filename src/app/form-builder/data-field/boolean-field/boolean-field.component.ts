import {Component, Input} from '@angular/core';
import {WrapperBoolean} from '../classes/wrapper-boolean';
import {BooleanField} from '../classes/boolean-field';

@Component({
  selector: 'nab-boolean-field',
  templateUrl: './boolean-field.component.html',
  styleUrls: ['./boolean-field.component.scss']
})
export class BooleanFieldComponent {
  @Input() datafieldObject: BooleanField;
  @Input() showLabel: WrapperBoolean;

  constructor() { }
}
