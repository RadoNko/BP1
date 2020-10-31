import {Component} from '@angular/core';
import {ResizeEvent} from 'angular-resizable-element';

@Component({
  selector: 'nab-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent {
  title = 'form-builder';
  width: number;

  constructor() {
  }

  onResizeEvent(event: ResizeEvent): void {
    if (event.rectangle.width > 450) {
      this.width = 450;
    } else if (event.rectangle.width < 200) {
      this.width = 200;
    } else {
      this.width = event.rectangle.width;
    }
  }
}
