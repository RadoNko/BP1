import {DataVariable} from '../../../modeler/classes/data-variable';
import {DataFieldObject} from './data-field-object';

export enum DatetimeFieldTypes {
  SIMPLE
}

export class DatetimeField extends DataFieldObject<Date> {

  constructor(
    id: string,
    title: string,
    initialValue: Date,
    usesSplitTemplate: boolean,
    behavior: string[],
    offset: number,
    placeholder: string,
    hint: string,
    materialAppearance: string,
    public type: DatetimeFieldTypes
  ) {
    super(id, title, initialValue, usesSplitTemplate, behavior, offset, placeholder, hint, materialAppearance);
  }

  createDatafield(): DataVariable {
    const datafield = super.createDatafield();
    // datafield.init = undefined; TODO:uncomment when datetime will has initial value
    datafield.type = 'dateTime';
    return datafield;
  }
}
