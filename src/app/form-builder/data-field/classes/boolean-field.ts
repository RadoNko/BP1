import {DataFieldObject} from './data-field-object';
import {DataVariable} from '../../../modeler/classes/data-variable';

export enum BooleanFieldTypes {
  SLIDE,
  CHECKBOX
}

export class BooleanField extends DataFieldObject<boolean> {

  constructor(
    id: string,
    title: string,
    initialValue: boolean,
    usesSplitTemplate: boolean,
    behavior: string[],
    offset: number,
    public type: BooleanFieldTypes) {
    super(id, title, initialValue, usesSplitTemplate, behavior, offset, undefined, undefined);
  }


  createDatafield(): DataVariable {
    const datafield = super.createDatafield();
    datafield.init = String(this.initialValue);
    datafield.type = 'boolean';
    return datafield;
  }
}
