import {Component, Input, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {FileField} from '../classes/file-field';
import {WrapperBoolean} from '../classes/wrapper-boolean';

@Component({
  selector: 'nab-file-field',
  templateUrl: './file-field.component.html',
  styleUrls: ['./file-field.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({opacity: 100})),
      transition('* => void', [
        animate(300, style({opacity: 0}))
      ])
    ])
  ]
})
export class FileFieldComponent implements OnInit {

  @Input() public datafieldObject: FileField;
  @Input() showLabel: WrapperBoolean;

  constructor() {
  }

  ngOnInit() {
  }
}
