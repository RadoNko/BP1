import {Component, Input} from '@angular/core';
import {WrapperBoolean} from '../../classes/wrapper-boolean';
import {TextField, TextFieldTypes} from '../../classes/text-field';

@Component({
  selector: 'nab-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss']
})
export class TextFieldComponent {

  @Input() datafieldObject: TextField;
  @Input() showLabel: WrapperBoolean;

  constructor() {
  }

  public isSimple(): boolean {
    return this.datafieldObject.type === TextFieldTypes.SIMPLE;
  }

  public isArea(): boolean {
    return this.datafieldObject.type === TextFieldTypes.AREA;
  }

}
