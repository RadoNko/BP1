import {Component, Input} from '@angular/core';
import {WrapperBoolean} from '../../classes/wrapper-boolean';
import {MultichoiceField} from '../../classes/multichoice-field';

@Component({
  selector: 'nab-select-multichoice-field',
  templateUrl: './select-multichoice-field.component.html',
  styleUrls: ['./select-multichoice-field.component.scss']
})
export class SelectMultichoiceFieldComponent {
  @Input() datafieldObject: MultichoiceField;
  @Input() showLabel: WrapperBoolean;

  constructor() { }
}
