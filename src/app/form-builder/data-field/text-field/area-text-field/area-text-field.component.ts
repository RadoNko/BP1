import {Component, Input} from '@angular/core';
import {WrapperBoolean} from '../../classes/wrapper-boolean';
import {TextField} from '../../classes/text-field';

@Component({
  selector: 'nab-area-text-field',
  templateUrl: './area-text-field.component.html',
  styleUrls: ['./area-text-field.component.scss']
})
export class AreaTextFieldComponent {
  @Input() datafieldObject: TextField;
  @Input() showLabel: WrapperBoolean;

  constructor() { }
}
