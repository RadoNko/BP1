import {Component, Input, OnInit} from '@angular/core';
import {WrapperBoolean} from '../classes/wrapper-boolean';
import {NumberField} from '../classes/number-field';

@Component({
  selector: 'nab-number-field',
  templateUrl: './number-field.component.html',
  styleUrls: ['./number-field.component.scss']
})
export class NumberFieldComponent implements OnInit {

  @Input() public datafieldObject: NumberField;
  @Input() showLabel: WrapperBoolean;

  constructor() {
  }

  ngOnInit(): void {
  }

}
