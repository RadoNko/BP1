import {Component, Input, TemplateRef} from '@angular/core';
import {ResizedEvent} from 'angular-resize-event';
import {WrapperBoolean} from './classes/wrapper-boolean';

@Component({
  selector: 'nab-data-field',
  templateUrl: './data-field.component.html',
  styleUrls: ['./data-field.component.scss']
})
export class DataFieldComponent {

  @Input() public title: string;
  @Input() public dataFieldTemplate: TemplateRef<any>;
  @Input() public layoutChangeWidthBreakpoint = 200;
  @Input() public splitTemplate: boolean;
  @Input() public offset: number;

  private _showLargeLayout: WrapperBoolean = new WrapperBoolean();

  get showLargeLayout(): WrapperBoolean {
    return this._showLargeLayout;
  }

  evaluateTemplateCondition(event: ResizedEvent): void {
    this._showLargeLayout.value = event.newWidth >= this.layoutChangeWidthBreakpoint && this.splitTemplate;
  }
}
