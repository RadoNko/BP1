import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {GridsterService} from '../gridster/gridster.service';
import {TextField} from '../data-field/classes/text-field';
import {MultichoiceField, MultichoiceFieldTypes} from '../data-field/classes/multichoice-field';
import {EnumerationField, EnumerationFieldTypes} from '../data-field/classes/enumeration-field';
import {BooleanField} from '../data-field/classes/boolean-field';
import {DataFieldObject} from '../data-field/classes/data-field-object';
import {DataFieldWithOptions} from '../data-field/classes/data-field-with-options';
import {NumberField} from '../data-field/classes/number-field';
import {DateField} from '../data-field/classes/date-field';
import {DatetimeField} from '../data-field/classes/datetime-field';
import {FileField} from '../data-field/classes/file-field';
import {TaskRefField} from '../data-field/classes/task-ref-field';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ModelService} from '../../modeler/model.service';
import {FileListField} from '../data-field/classes/file-list-field';
import {NGX_MAT_DATE_FORMATS} from '@angular-material-components/datetime-picker';
import {DATE_TIME_FORMAT} from '../data-field/datetime-field/time-formats';
import {UserField} from '../data-field/classes/user-field';

@Component({
  selector: 'nab-edit-panel',
  templateUrl: './edit-panel.component.html',
  styleUrls: ['./edit-panel.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        minWidth: '300px'
      })),
      state('closed', style({
        minWidth: '180px'
      })),
      transition('open => closed', [
        animate('0.3s')
      ]),
      transition('closed => open', [
        animate('0.3s')
      ]),
    ]),
  ],
  providers: [
    {provide: NGX_MAT_DATE_FORMATS, useValue: DATE_TIME_FORMAT}
  ]
})
export class EditPanelComponent implements OnInit, AfterViewInit {
  numOfCols: number;
  maxOfCols: number;
  minOfCols: number;
  error: boolean;
  hover: boolean;
  counter: number;

  // all variables reference the same object with different types because HTMl can't use casting in binding expressions
  gridsterObjectData: DataFieldObject<any>;
  optionsObjectData: DataFieldWithOptions<any>;

  behaviorOptions = [{key: 'visible', value: 'Visible'}, {key: 'editable', value: 'Editable'}, {key: 'required', value: 'Required'}, {key: 'hidden', value: 'Hidden'}, {key: 'forbidden', value: 'Forrbiden'}];

  constructor(private gridsterService: GridsterService, public modelService: ModelService) {
  }

  ngOnInit() {
    this.maxOfCols = 6;

    const id = localStorage.getItem('TransitionId');
    if (id === null) {
      this.numOfCols = 4;
      this.minOfCols = 1;
      this.gridsterService.options.minCols = this.numOfCols;
      this.gridsterService.options.maxCols = this.numOfCols;
      this.gridsterService.options.maxItemCols = this.numOfCols;
    } else {
      this.numOfCols = this.modelService.model.transitions.find((item) => item.id === id).numCols;
      this.minOfCols = 1;
      this.gridsterService.placedDataFields.forEach(item => {
        if (item.x + item.cols > this.minOfCols) {
          this.minOfCols = item.x + item.cols;
        }
      });
      this.gridsterService.options.minCols = this.numOfCols;
      this.gridsterService.options.maxCols = this.numOfCols;
      this.gridsterService.options.maxItemCols = this.numOfCols;
    }

    this.gridsterService.editedGridsterObjectStream.subscribe(it => {
      this.gridsterObjectData = it;
      this.optionsObjectData = it as DataFieldWithOptions<any>;
    });

    this.hover = false;
    this.error = false;
    this.counter = 0;
    this.modelService.transitionOffset = this.modelService.transition ? this.modelService.transition.offset : 0;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.notifyGridster();
    });
  }

  @HostListener('mouseenter')
  onHover() {
    this.hover = true;
  }

  @HostListener('mouseleave')
  onNoHover() {
    this.hover = false;
  }

  changeCols($event) {
    let minNum = 1;
    this.gridsterService.placedDataFields.forEach(item => {
      if (item.x + item.cols > minNum) {
        minNum = item.x + item.cols;
      }
    });
    this.minOfCols = minNum;
    if ($event.target.value < this.minOfCols || $event.target.value > this.maxOfCols) {
      this.error = true;
    } else {
      this.gridsterService.options.minCols = $event.target.value;
      this.gridsterService.options.maxCols = $event.target.value;
      this.gridsterService.options.maxItemCols = $event.target.value;
      this.gridsterService.options.api.optionsChanged();
      this.error = false;
    }
  }

  isSomeGridsterFieldSelected() {
    return this.gridsterService.itemIndex > -1 && this.gridsterService.itemIndex < this.gridsterService.placedDataFields.length;
  }

  hasOptions(): boolean {
    return this.isSomeGridsterFieldSelected() &&
      this.gridsterObjectData instanceof DataFieldWithOptions;
  }

  hasTextValue(): boolean {
    return this.isSomeGridsterFieldSelected() &&
      this.gridsterObjectData instanceof TextField;
  }

  isListOptionsDisplay(): boolean {
    return this.hasOptions() &&
      ((this.gridsterObjectData as EnumerationField).type === EnumerationFieldTypes.LIST || (this.gridsterObjectData as MultichoiceField).type === MultichoiceFieldTypes.LIST);
  }

  isBoolean(): boolean {
    return this.isSomeGridsterFieldSelected() &&
      this.gridsterObjectData instanceof BooleanField;
  }

  isEnumeration(): boolean {
    return this.isSomeGridsterFieldSelected() &&
      this.gridsterObjectData instanceof EnumerationField;
  }

  isMultichoice(): boolean {
    return this.isSomeGridsterFieldSelected() &&
      this.gridsterObjectData instanceof MultichoiceField;
  }

  AddOption() {
    this.optionsObjectData.options.push('value');
  }

  DeleteOption(item) {
    const index = this.optionsObjectData.options.findIndex(it => it === item);
    this.optionsObjectData.options.splice(index, 1);
  }

  notifyGridster(): void {
    this.gridsterService.options.api.optionsChanged();
  }

  isNumber(): boolean {
    return this.isSomeGridsterFieldSelected() &&
      this.gridsterObjectData instanceof NumberField;
  }

  isDate(): boolean {
    return this.isSomeGridsterFieldSelected() &&
      this.gridsterObjectData instanceof DateField;
  }

  isDatetime(): boolean {
    return this.isSomeGridsterFieldSelected() &&
      this.gridsterObjectData instanceof DatetimeField;
  }

  isFile(): boolean {
    return this.isSomeGridsterFieldSelected() &&
      this.gridsterObjectData instanceof FileField;
  }

  isFileList(): boolean {
    return this.isSomeGridsterFieldSelected() &&
      this.gridsterObjectData instanceof FileListField;
  }

  isTaskCaseRef(): boolean {
    return this.isSomeGridsterFieldSelected() &&
      (this.gridsterObjectData instanceof TaskRefField);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.optionsObjectData.options, event.previousIndex, event.currentIndex);
    this.notifyGridster();
  }

  whichField() {
    if (this.hasTextValue()) {
      return 'TextField';
    }
    if (this.isBoolean()) {
      return 'BooleanField';
    }
    if (this.isNumber()) {
      return 'NumberField';
    }
    if (this.isDate()) {
      return 'DateField';
    }
    if (this.isDatetime()) {
      return 'DateTimeField';
    }
    if (this.isFile()) {
      return 'FileField';
    }
    if (this.isFileList()) {
      return 'FileListField';
    }
    if (this.isEnumeration()) {
      return 'EnumerationField';
    }
    if (this.isMultichoice()) {
      return 'MultichoiceField';
    }
    if (this.isTaskCaseRef()) {
      return 'TaskRef';
    }
    if (this.gridsterObjectData instanceof UserField) {
      return 'UserField';
    }
  }
}
