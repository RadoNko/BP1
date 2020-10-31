import {Component, Input} from '@angular/core';
import {WrapperBoolean} from '../../classes/wrapper-boolean';
import {MultichoiceField} from '../../classes/multichoice-field';

@Component({
  selector: 'nab-list-multichoice-field',
  templateUrl: './list-multichoice-field.component.html',
  styleUrls: ['./list-multichoice-field.component.scss']
})
export class ListMultichoiceFieldComponent {
  @Input() datafieldObject: MultichoiceField;
  @Input() showLabel: WrapperBoolean;

  constructor() { }
}
