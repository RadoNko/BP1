import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ModelService} from '../../modeler/model.service';
import {GridsterService} from '../gridster/gridster.service';
import {Router} from '@angular/router';
import {ExistingDatafield} from './classes/existing-datafield';
import {FieldListService, FieldType} from './field-list.service';
import {EventType} from './classes/gridster-existing-field-event';
import {DataVariable} from '../../modeler/classes/data-variable';
import {DataRef} from '../../modeler/classes/data-ref';
import {DataFieldObject} from '../data-field/classes/data-field-object';
import {DatafieldTransformer} from '../gridster/datafield.transformer';
import {EnumerationField, EnumerationFieldTypes} from '../data-field/classes/enumeration-field';
import {MultichoiceField, MultichoiceFieldTypes} from '../data-field/classes/multichoice-field';
import {BooleanField, BooleanFieldTypes} from '../data-field/classes/boolean-field';
import {TextField, TextFieldTypes} from '../data-field/classes/text-field';
import {NumberField, NumberFieldTypes} from '../data-field/classes/number-field';
import {DateField, DateFieldTypes} from '../data-field/classes/date-field';
import {DatetimeField, DatetimeFieldTypes} from '../data-field/classes/datetime-field';
import {FileField, FileFieldTypes} from '../data-field/classes/file-field';
import {UserField, UserFieldTypes} from '../data-field/classes/user-field';
import {TaskRefField, TaskRefFieldTypes} from '../data-field/classes/task-ref-field';
import {FileListField, FileListFieldTypes} from '../data-field/classes/file-list-field';
import {timer} from 'rxjs';
import {MatExpansionPanel} from '@angular/material/expansion';
import {MatSnackBar} from '@angular/material/snack-bar';

export interface Data {
  title: string;
  viewTitle: string;
  template: string;
  dialogTitle: string;
}

@Component({
  selector: 'nab-field-list',
  templateUrl: './field-list.component.html',
  styleUrls: ['./field-list.component.scss']
})
export class FieldListComponent implements OnInit, AfterViewInit {

  @ViewChild('existingFieldPanel') existingFieldsPanel: MatExpansionPanel;
  @ViewChild('newFieldsPanel') newFieldsPanel: MatExpansionPanel;

  dataFields: any[];

  existingDataFields: Array<ExistingDatafield> = [];
  public existingFieldsSearchInput = '';

  constructor(public dialog: MatDialog, private router: Router, private modelService: ModelService,
              private gridsterService: GridsterService, private fieldListService: FieldListService, private _snackBar: MatSnackBar) {
    if (this.modelService.model !== undefined) {
      // TODO remove the array with supported types once all datafield types are supported
      this.existingDataFields = this.modelService.model.processData.filter(datafield =>
        ['text', 'enumeration', 'multichoice', 'boolean', 'number', 'date', 'datetime', 'file', 'fileList', 'user', 'taskRef', 'caseRef'].some(it => it === datafield.type)).map(datafield => new ExistingDatafield(datafield));
      this.existingDataFields.sort((a, b) => {
        if (a.title > b.title) {
          return 1;
        }
        if (a.title < b.title) {
          return -1;
        }
        return 0;
      });
      const referencedFields = new Set<string>();
      this.gridsterService.placedDataFields.forEach(gridsterObject => {
        referencedFields.add(gridsterObject.datafield.id);
      });
      this.existingDataFields.forEach(field => {
        field.placedInForm = referencedFields.has(field.datafield.id);
      });
    }
    this.dataFields = JSON.parse(JSON.stringify(this.fieldListService.fieldListArray));
  }

  ngOnInit(): void {
    this.fieldListService.existingFieldEvents.subscribe(event => {
      const field = this.existingDataFields.find(it => it.datafield.id === event.fieldId);
      if (field !== undefined) {
        if (event.type === EventType.PLACED) {
          field.placedInForm = true;
        } else if (event.type === EventType.REMOVED) {
          field.placedInForm = false;
        }
      }
    });

    document.getElementById('ctxMenu').style.visibility = 'hidden';
    this.gridsterService.itemIndex = -1;
  }

  ngAfterViewInit(): void {
    if (this.existingDataFields && this.existingDataFields.length !== 0) {
      this.openPanel(this.existingFieldsPanel);
    } else {
      this._snackBar.open('No existing data fields were found', null, {
        duration: 500
      });
      this.openPanel(this.newFieldsPanel);
    }
  }

  openPanel(expansion: MatExpansionPanel): void {
    timer(0).subscribe(_ => expansion.open());
  }

  dragStartHandler($event: DragEvent, existingField: boolean) {
    $event.dataTransfer.setData('existingField', String(existingField));
    $event.dataTransfer.dropEffect = 'copy';
  }

  dragStartHandlerNew($event: DragEvent, type: any, fieldView: string, template?: string) {
    $event.dataTransfer.setData('type', type.type);
    let dataFieldObject: DataFieldObject<any>;
    switch (type.type) {
      case FieldType.Enumeration:
        dataFieldObject = new EnumerationField(
          '',
          'set label',
          'option1',
          ['option1', 'option2', 'option3'],
          false,
          ['editable'],
          0,
          'placeholder',
          'description',
          'outline',
          fieldView === 'Select' ? EnumerationFieldTypes.SELECT : EnumerationFieldTypes.LIST
        );
        break;
      case FieldType.Multichoice:
        dataFieldObject = new MultichoiceField(
          '',
          'set label',
          ['option1', 'option2'],
          ['option1', 'option2', 'option3'],
          false,
          ['editable'],
          0,
          'placeholder',
          'description',
          'outline',
          fieldView === 'Select' ? MultichoiceFieldTypes.SELECT : MultichoiceFieldTypes.LIST
        );
        break;
      case FieldType.Boolean:
        dataFieldObject = new BooleanField(
          '',
          'set label',
          false,
          false,
          ['editable'],
          0,
          BooleanFieldTypes.SLIDE
        );
        break;
      case FieldType.Text:
        dataFieldObject = new TextField(
          '',
          'set label',
          'value',
          false,
          ['editable'],
          0,
          'placeholder',
          'description',
          'outline',
          fieldView === 'Simple' ? TextFieldTypes.SIMPLE : TextFieldTypes.AREA
        );
        break;
      case FieldType.Number:
        dataFieldObject = new NumberField(
          '',
          'set label',
          0,
          false,
          ['editable'],
          0,
          'placeholder',
          'description',
          'outline',
          NumberFieldTypes.SIMPLE
        );
        break;
      case FieldType.Date:
        dataFieldObject = new DateField(
          '',
          'set label',
          new Date(),
          false,
          ['editable'],
          0,
          'placeholder',
          'description',
          'outline',
          DateFieldTypes.SIMPLE
        );
        break;
      case FieldType.Datetime:
        dataFieldObject = new DatetimeField(
          '',
          'set label',
          new Date(),
          false,
          ['editable'],
          0,
          'placeholder',
          'description',
          'outline',
          DatetimeFieldTypes.SIMPLE
        );
        break;
      case FieldType.File:
        dataFieldObject = new FileField(
          '',
          'set label',
          false,
          ['editable'],
          0,
          'placeholder',
          FileFieldTypes.SIMPLE
        );
        break;
      case FieldType.FileList:
        dataFieldObject = new FileListField(
          '',
          'set label',
          false,
          ['editable'],
          0,
          'placeholder',
          FileListFieldTypes.SIMPLE
        );
        break;
      case FieldType.User:
        dataFieldObject = new UserField(
          '',
          'set label',
          false,
          ['editable'],
          0,
          'placeholder',
          'description',
          'outline',
          UserFieldTypes.SIMPLE
        );
        break;
      case FieldType.TaskRef:
        dataFieldObject = new TaskRefField(
          '',
          'set label',
          'value',
          false,
          ['editable'],
          0,
          'placeholder',
          'description',
          'outline',
          TaskRefFieldTypes.SIMPLE
        );
        break;
    }

    this.fieldListService.draggedObjectsStream.next(dataFieldObject);
    this.dragStartHandler($event, false);
  }

  dragStartHandlerExisting($event: DragEvent, datafield: DataVariable) {
    this.fieldListService.draggedObjectsStream.next(DatafieldTransformer.createGridsterDatafieldObject(datafield, ['editable']));
    $event.dataTransfer.setData('type', 'existing field');
    this.dragStartHandler($event, true);
  }

  remove(item, fieldType) {
    const itemIndex = this.dataFields[this.dataFields.indexOf(fieldType)].views.indexOf(item);
    this.dataFields[this.dataFields.indexOf(fieldType)].views.splice(itemIndex, 1);
  }

  saveToTransition() {
    const id = localStorage.getItem('TransitionId');
    if (id === null) {
      this._snackBar.open('Transition is not selected!');
    } else {
      if (this.modelService.model.transitions.find((item) => item.id === id)) {
        this.saveModelAndTransition(this.modelService.model.identifier, id);
      }
    }
  }

  shortening(title: string) {
    if (title.length > 10) {
      const tmp = title.slice(0, 10);
      return tmp + '...';
    }
    return title;
  }

  private _editDatafield(datafield: DataVariable, updatedValues: DataVariable): void {
    datafield.name = updatedValues.name;
    datafield.values = updatedValues.values;
    datafield.value = updatedValues.value;
    datafield.placeholder = updatedValues.placeholder;
    datafield.desc = updatedValues.desc;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
    });
  }

  containsSearchExpression(item: ExistingDatafield): boolean {
    return item.title.toLocaleLowerCase().includes(this.existingFieldsSearchInput.toLocaleLowerCase());
  }

  backModeler() {
    localStorage.removeItem('TransitionId');
    this.router.navigate(['/modeler']);
    this.gridsterService.placedDataFields = [];
    this.gridsterService.options.api.optionsChanged();
  }


  saveModelAndTransition(modelId: string, transitionId: string) {
    const transition = this.modelService.model.transitions.find((item) => item.id === transitionId);
    transition.data = (this.gridsterService.placedDataFields as []);
    if (this.gridsterService.options.minCols !== 4) {
      transition.cols = this.gridsterService.options.minCols;
    }

    const preexistingDatarefs = transition.dataRefs;
    transition.dataRefs = [];

    transition.data.forEach(gridsterDataObject => {
      const datafield = this.modelService.model.processData.find(it => it.id === gridsterDataObject.datafield.id);
      if (datafield === undefined) {
        // new
        this.modelService.model.processData.push(gridsterDataObject.datafield.createDatafield());
      } else {
        // edited (we change the values in the referenced object)
        this._editDatafield(datafield, gridsterDataObject.datafield.createDatafield());
      }

      let dataRef = preexistingDatarefs.find(it => it.id === gridsterDataObject.datafield.id);
      if (dataRef === undefined) {
        dataRef = new DataRef(gridsterDataObject.datafield.id);
      }
      dataRef.layout = {
        x: gridsterDataObject.x,
        y: gridsterDataObject.y,
        rows: gridsterDataObject.rows,
        cols: gridsterDataObject.cols,
        offset: gridsterDataObject.datafield.offset,
        template: gridsterDataObject.datafield.usesSplitTemplate ? 'split' : 'material',
        appearance: gridsterDataObject.datafield.materialAppearance,
      };
      if (gridsterDataObject.datafield.behavior.length === 0) {
        dataRef.logic.behaviors.push('editable');
        gridsterDataObject.datafield.behavior.push('editable');
      } else {
        dataRef.logic.behaviors = [...gridsterDataObject.datafield.behavior];
      }
      transition.dataRefs.push(dataRef);
    });

    this.modelService.model.transitions[this.modelService.model.transitions.findIndex((item) => item.id === transitionId)] = transition;
    transition.offset = this.modelService.transitionOffset;
    localStorage.removeItem('TransitionId');
    this.router.navigate(['/modeler']);
    this.gridsterService.placedDataFields = [];
    this.gridsterService.options.api.optionsChanged();
  }
}
