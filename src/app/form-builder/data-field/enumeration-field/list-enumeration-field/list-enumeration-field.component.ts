import {Component, Input} from '@angular/core';
import {WrapperBoolean} from '../../classes/wrapper-boolean';
import {EnumerationField} from '../../classes/enumeration-field';

@Component({
  selector: 'nab-list-enumeration-field',
  templateUrl: './list-enumeration-field.component.html',
  styleUrls: ['./list-enumeration-field.component.scss']
})
export class ListEnumerationFieldComponent {
  @Input() datafieldObject: EnumerationField;
  @Input() showLabel: WrapperBoolean;

  constructor() {
  }
}
