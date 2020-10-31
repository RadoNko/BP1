import {DataVariable, DataView} from '../../modeler/classes/data-variable';
import {DataFieldObject} from '../data-field/classes/data-field-object';
import {TextField, TextFieldTypes} from '../data-field/classes/text-field';
import {BooleanField, BooleanFieldTypes} from '../data-field/classes/boolean-field';
import {EnumerationField, EnumerationFieldTypes} from '../data-field/classes/enumeration-field';
import {MultichoiceField, MultichoiceFieldTypes} from '../data-field/classes/multichoice-field';
import {GridsterDataField} from './classes/gridster-data-field';
import {NumberField, NumberFieldTypes} from '../data-field/classes/number-field';
import {DateField, DateFieldTypes} from '../data-field/classes/date-field';
import {DatetimeField, DatetimeFieldTypes} from '../data-field/classes/datetime-field';
import {FileField, FileFieldTypes} from '../data-field/classes/file-field';
import {UserField, UserFieldTypes} from '../data-field/classes/user-field';
import {TaskRefField, TaskRefFieldTypes} from '../data-field/classes/task-ref-field';
import {DataRef} from '../../modeler/classes/data-ref';
import {FileListField, FileListFieldTypes} from '../data-field/classes/file-list-field';

export class DatafieldTransformer {

  constructor() {
  }

  public static createGridsterDatafieldObject(datafield: DataVariable, dataRefBehavior: string[], template = false, appearance = 'outline'): DataFieldObject<any> {
    // TODO loading custom templates from datafields
    // TODO loading usesSplitTemplate and materialAppearance from datafields
    // TODO loading x,y, width and height from datafields (data refs?)
    switch (datafield.type) {
      case 'boolean':
        return new BooleanField(
          datafield.id,
          datafield.name,
          datafield.init.toLocaleLowerCase() === 'true',
          template,
          [...dataRefBehavior],
          0,
          BooleanFieldTypes.SLIDE
        );
      case 'enumeration':
        return new EnumerationField(
          datafield.id,
          datafield.name,
          datafield.init,
          datafield.values,
          template,
          [...dataRefBehavior],
          0,
          datafield.placeholder,
          datafield.desc,
          appearance,
          datafield.view === DataView.LIST ? EnumerationFieldTypes.LIST : EnumerationFieldTypes.SELECT
        );
      case 'multichoice':
        return new MultichoiceField(
          datafield.id,
          datafield.name,
          datafield.init.split(',').map(it => it.trim()),
          datafield.values,
          template,
          [...dataRefBehavior],
          0,
          datafield.placeholder,
          datafield.desc,
          appearance,
          datafield.view === DataView.LIST ? MultichoiceFieldTypes.LIST : MultichoiceFieldTypes.SELECT
        );
      case 'number':
        return new NumberField(
          datafield.id,
          datafield.name,
          Number(datafield.init).valueOf(),
          template,
          [...dataRefBehavior],
          0,
          datafield.placeholder,
          datafield.desc,
          appearance,
          NumberFieldTypes.SIMPLE
        );
      case 'date':
        return new DateField(
          datafield.id,
          datafield.name,
          new Date(),
          template,
          [...dataRefBehavior],
          0,
          datafield.placeholder,
          datafield.desc,
          appearance,
          DateFieldTypes.SIMPLE
        );
      case 'datetime':
        return new DatetimeField(
          datafield.id,
          datafield.name,
          new Date(),
          template,
          [...dataRefBehavior],
          0,
          datafield.placeholder,
          datafield.desc,
          appearance,
          DatetimeFieldTypes.SIMPLE
        );
      case 'file':
        return new FileField(
          datafield.id,
          datafield.name,
          template,
          [...dataRefBehavior],
          0,
          datafield.placeholder,
          FileFieldTypes.SIMPLE
        );
      case 'fileList':
        return new FileListField(
          datafield.id,
          datafield.name,
          template,
          [...dataRefBehavior],
          0,
          datafield.placeholder,
          FileListFieldTypes.SIMPLE
        );
      case 'user':
        return new UserField(
          datafield.id,
          datafield.name,
          template,
          [...dataRefBehavior],
          0,
          datafield.placeholder,
          datafield.desc,
          appearance,
          UserFieldTypes.SIMPLE
        );
      case 'taskRef':
        return new TaskRefField(
          datafield.id,
          datafield.name,
          datafield.init,
          template,
          [...dataRefBehavior],
          0,
          datafield.placeholder,
          datafield.desc,
          appearance,
          TaskRefFieldTypes.SIMPLE
        );
      default: // includes 'text'
        return new TextField(
          datafield.id,
          datafield.name,
          datafield.init,
          template,
          [...dataRefBehavior],
          0,
          datafield.placeholder,
          datafield.desc,
          appearance,
          datafield.values.some(it => it === 'area') ? TextFieldTypes.AREA : TextFieldTypes.SIMPLE
        );
    }
  }

  public static createGridsterWrapperObject(dataField: DataVariable, dataRef: DataRef, x: number, y: number, cols: number, rows = 1, splitTemplate = false, appearance = 'outline'): GridsterDataField {
    if (dataRef.layout !== undefined) {
      x = dataRef.layout.x;
      y = dataRef.layout.y;
      rows = dataRef.layout.rows;
      cols = dataRef.layout.cols;
      splitTemplate = dataRef.layout.template === 'split';
      appearance = dataRef.layout.appearance;
    }
    return new GridsterDataField({x, y, rows, cols}, DatafieldTransformer.createGridsterDatafieldObject(dataField, dataRef.logic.behaviors, splitTemplate, appearance));
  }
}
