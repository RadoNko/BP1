import {Injectable} from '@angular/core';
import {CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType} from 'angular-gridster2';
import {BehaviorSubject, Subject} from 'rxjs';
import {GridsterDataField} from './classes/gridster-data-field';
import {ModelService} from '../../modeler/model.service';
import {FieldListService} from '../field-list/field-list.service';
import {DataFieldObject} from '../data-field/classes/data-field-object';
import {EventType, GridsterExistingFieldEvent} from '../field-list/classes/gridster-existing-field-event';
import {EnumerationField, EnumerationFieldTypes} from '../data-field/classes/enumeration-field';

@Injectable({
  providedIn: 'root'
})

export class GridsterService {
  options: GridsterConfig;
  placedDataFields: Array<GridsterDataField>;
  editedGridsterObjectStream: Subject<DataFieldObject<any>>;
  itemIndex: number;

  private lastDraggedField: DataFieldObject<any>;

  mapCounter: Map<string, number>;

  constructor(private modelService: ModelService, private fieldListService: FieldListService) {
    // const id = localStorage.getItem('TransitionId');
    // const transition = this.modelService.model.transitions.find((item) => item.id === id);
    this.options = {
      gridType: GridType.VerticalFixed,
      compactType: CompactType.None,
      margin: 0,
      useTransformPositioning: true,
      mobileBreakpoint: 640,
      minCols: 4,
      maxCols: 4,
      minRows: 1,
      maxRows: 1000,
      maxItemCols: 4,
      minItemCols: 1,
      maxItemRows: 10,
      minItemRows: 1,
      maxItemArea: 2500,
      minItemArea: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      fixedColWidth: 105,
      fixedRowHeight: 110,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrag: false,
      enableOccupiedCellDrop: false,
      emptyCellDragMaxCols: 4,
      emptyCellDragMaxRows: 50,
      ignoreMarginInRow: false,
      draggable: {
        enabled: true,
      },
      resizable: {
        enabled: true,
      },
      swap: false,
      pushItems: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: {north: true, east: true, south: true, west: true},
      pushResizeItems: false,
      displayGrid: DisplayGrid.OnDragAndResize,
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false,
      emptyCellDropCallback: this.emptyCellClick.bind(this),
      emptyCellDragCallback: this.emptyCellClick.bind(this),
      enableEmptyCellDrop: true,
    };

    this.placedDataFields = [];
    // with regular Subject stream it could rarely happen that the click was registered before the object was sent and angular attempted to bind undefined object properties. This object has all properties defined and will not spam the console with errors if this happens.
    this.editedGridsterObjectStream = new BehaviorSubject<DataFieldObject<any>>(new EnumerationField('', '', '', [], false, ['editable'], 0, '', '', 'outline', EnumerationFieldTypes.SELECT));
    this.itemIndex = -1;

    this.mapCounter = new Map<string, number>();

    this.fieldListService.draggedObjectsStream.subscribe( newDraggable => {
      this.lastDraggedField = newDraggable;
    });
  }

  emptyCellClick(event: DragEvent, item: GridsterItem) {
    const type = event.dataTransfer.getData('type');
    if (type !== '') {
      const isExistingField = event.dataTransfer.getData('existingField') === 'true';

      const dataFieldObject = this.lastDraggedField;

      if (!isExistingField) {
        dataFieldObject.id = this.createId(type);
      } else {
        this.fieldListService.existingFieldEvents.next( new GridsterExistingFieldEvent(EventType.PLACED, dataFieldObject.id));
      }

      this.placedDataFields.push(new GridsterDataField(item, dataFieldObject));
      this.editDatafield(this.placedDataFields[this.placedDataFields.length - 1]);
    }
  }

  public editDatafield(gridsterDataField: GridsterDataField): void {
    this.itemIndex = this.placedDataFields.indexOf(gridsterDataField);
    this.editedGridsterObjectStream.next(gridsterDataField.datafield);
  }

  private createId(type: string) {
    let counter: number;
    if (this.mapCounter.has(type)) {
      counter = this.mapCounter.get(type);
      this.mapCounter.set(type, counter + 1);
    } else {
      counter = 0;
      this.mapCounter.set(type, counter + 1);
    }
    try {
      if (this.modelService.model.processData.find(item => item.id === type + '_' + counter)) {
        return this.createId(type);
      } else {
        return type + '_' + counter;
      }
    } catch (e) {
      return type + '_' + counter;
    }
  }
}
