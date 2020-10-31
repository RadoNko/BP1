import {Component, Input} from '@angular/core';
import {EnumerationField, EnumerationFieldTypes} from '../../classes/enumeration-field';
import {WrapperBoolean} from '../../classes/wrapper-boolean';

@Component({
  selector: 'nab-enumeration-field',
  templateUrl: './enumeration-field.component.html',
  styleUrls: ['./enumeration-field.component.scss']
})
export class EnumerationFieldComponent {
  @Input() datafieldObject: EnumerationField;
  @Input() showLabel: WrapperBoolean;

  constructor() {
  }

  public isSelect(): boolean {
    return this.datafieldObject.type === EnumerationFieldTypes.SELECT;
  }

  public isList(): boolean {
    return this.datafieldObject.type === EnumerationFieldTypes.LIST;
  }

}
