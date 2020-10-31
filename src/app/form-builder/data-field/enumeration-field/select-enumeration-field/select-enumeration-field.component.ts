import {Component, Input} from '@angular/core';
import {WrapperBoolean} from '../../classes/wrapper-boolean';
import {EnumerationField} from '../../classes/enumeration-field';

@Component({
  selector: 'nab-select-enumeration-field',
  templateUrl: './select-enumeration-field.component.html',
  styleUrls: ['./select-enumeration-field.component.scss']
})
export class SelectEnumerationFieldComponent {
  @Input() datafieldObject: EnumerationField;
  @Input() showLabel: WrapperBoolean;

  constructor() { }
}
