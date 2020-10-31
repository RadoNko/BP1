import {GridsterItem, GridsterItemComponentInterface} from 'angular-gridster2';
import {DataFieldObject} from '../../data-field/classes/data-field-object';

export class GridsterDataField implements GridsterItem {
  x: number;
  y: number;
  rows: number;
  cols: number;
  compactEnabled: boolean;
  dragEnabled: boolean;
  initCallback: (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => void;
  maxItemArea: number;
  maxItemCols: number;
  maxItemRows: number;
  minItemArea: number;
  minItemCols: number;
  minItemRows: number;
  resizeEnabled: boolean;
  datafield: DataFieldObject<any>;

  constructor(item: GridsterItem, dataFieldObject: DataFieldObject<any>) {
    this.x = item.x;
    this.y = item.y;
    this.rows = item.rows;
    this.cols = item.cols;
    this.compactEnabled = item.compactEnabled;
    this.dragEnabled = item.dragEnabled;
    this.initCallback = item.initCallback;
    this.maxItemArea = item.maxItemArea;
    this.maxItemCols = item.maxItemCols;
    this.maxItemRows = item.maxItemRows;
    this.minItemArea = item.minItemArea;
    this.minItemCols = item.minItemCols;
    this.minItemRows = item.minItemRows;
    this.resizeEnabled = item.resizeEnabled;
    this.datafield = dataFieldObject;
  }
}
