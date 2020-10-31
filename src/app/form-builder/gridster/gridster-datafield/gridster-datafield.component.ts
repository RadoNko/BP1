import {Component, Input, QueryList, TemplateRef, ViewChildren} from '@angular/core';
import {DataFieldObject} from '../../data-field/classes/data-field-object';
import {BooleanField} from '../../data-field/classes/boolean-field';
import {EnumerationField} from '../../data-field/classes/enumeration-field';
import {MultichoiceField} from '../../data-field/classes/multichoice-field';
import {TextField} from '../../data-field/classes/text-field';
import {NumberField} from '../../data-field/classes/number-field';
import {DateField} from '../../data-field/classes/date-field';
import {DatetimeField} from '../../data-field/classes/datetime-field';
import {FileField} from '../../data-field/classes/file-field';
import {UserField} from '../../data-field/classes/user-field';
import {TaskRefField} from '../../data-field/classes/task-ref-field';
import {FileListField} from '../../data-field/classes/file-list-field';
import {ModelService} from '../../../modeler/model.service';

@Component({
  selector: 'nab-gridster-datafield',
  templateUrl: './gridster-datafield.component.html',
  styleUrls: ['./gridster-datafield.component.scss']
})
export class GridsterDatafieldComponent {

  @Input() public datafield: DataFieldObject<any>;
  @ViewChildren(TemplateRef) templates: QueryList<TemplateRef<any>>;

  constructor(public modelService: ModelService) { }

  isBoolean(): boolean {
    return this.datafield instanceof BooleanField;
  }

  isEnumeration(): boolean {
    return this.datafield instanceof EnumerationField;
  }

  isMultichoice(): boolean {
    return this.datafield instanceof MultichoiceField;
  }

  isText(): boolean {
    return this.datafield instanceof TextField;
  }

  isNumber(): boolean {
    return this.datafield instanceof NumberField;
  }

  isDate(): boolean {
    return this.datafield instanceof DateField;
  }

  isDatetime(): boolean {
    return this.datafield instanceof DatetimeField;
  }

  isFile(): boolean {
    return this.datafield instanceof FileField;
  }

  isFileList(): boolean {
    return this.datafield instanceof FileListField;
  }

  isUser(): boolean {
    return this.datafield instanceof UserField;
  }

  isTaskRef(): boolean {
    return this.datafield instanceof TaskRefField;
  }
}
