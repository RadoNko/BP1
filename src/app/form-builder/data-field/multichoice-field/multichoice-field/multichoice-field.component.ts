import {Component, Input} from '@angular/core';
import {WrapperBoolean} from '../../classes/wrapper-boolean';
import {MultichoiceField, MultichoiceFieldTypes} from '../../classes/multichoice-field';

@Component({
  selector: 'nab-multichoice-field',
  templateUrl: './multichoice-field.component.html',
  styleUrls: ['./multichoice-field.component.scss']
})
export class MultichoiceFieldComponent {

  @Input() datafieldObject: MultichoiceField;
  @Input() showLabel: WrapperBoolean;

  constructor() {
  }

  public isSelect(): boolean {
    return this.datafieldObject.type === MultichoiceFieldTypes.SELECT;
  }

  public isList(): boolean {
    return this.datafieldObject.type === MultichoiceFieldTypes.LIST;
  }

}
