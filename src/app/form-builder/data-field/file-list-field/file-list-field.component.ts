import {Component, Input, OnInit} from '@angular/core';
import {WrapperBoolean} from '../classes/wrapper-boolean';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {FileListField} from '../classes/file-list-field';

@Component({
  selector: 'nab-file-list-field',
  templateUrl: './file-list-field.component.html',
  styleUrls: ['./file-list-field.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({opacity: 100})),
      transition('* => void', [
        animate(300, style({opacity: 0}))
      ])
    ])
  ]
})
export class FileListFieldComponent implements OnInit {
  @Input() public datafieldObject: FileListField;
  @Input() showLabel: WrapperBoolean;

  constructor() {
  }

  ngOnInit(): void {
  }

}
