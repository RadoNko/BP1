import {Component, Input, OnInit} from '@angular/core';
import {WrapperBoolean} from '../classes/wrapper-boolean';
import {UserField} from '../classes/user-field';

@Component({
  selector: 'nab-user-field',
  templateUrl: './user-field.component.html',
  styleUrls: ['./user-field.component.scss']
})
export class UserFieldComponent implements OnInit {

  @Input() public datafieldObject: UserField;
  @Input() showLabel: WrapperBoolean;

  constructor() {
  }

  ngOnInit(): void {
  }

}
