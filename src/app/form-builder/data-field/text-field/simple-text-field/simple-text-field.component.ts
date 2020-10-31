import {Component, Input} from '@angular/core';
import {WrapperBoolean} from '../../classes/wrapper-boolean';
import {TextField} from '../../classes/text-field';

@Component({
  selector: 'nab-simple-text-field',
  templateUrl: './simple-text-field.component.html',
  styleUrls: ['./simple-text-field.component.scss']
})
export class SimpleTextFieldComponent {
  @Input() datafieldObject: TextField;
  @Input() showLabel: WrapperBoolean;

  constructor() {
  }
}
