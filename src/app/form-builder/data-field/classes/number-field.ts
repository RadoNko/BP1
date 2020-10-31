import {DataFieldObject} from './data-field-object';
import {DataVariable} from '../../../modeler/classes/data-variable';

export enum NumberFieldTypes {
  SIMPLE
}

export class NumberField extends DataFieldObject<number> {

  constructor(
    id: string,
    title: string,
    initialValue: number,
    usesSplitTemplate: boolean,
    behavior: string[],
    offset: number,
    placeholder: string,
    hint: string,
    materialAppearance: string,
    public type: NumberFieldTypes
  ) {
    super(id, title, initialValue, usesSplitTemplate, behavior, offset, placeholder, hint, materialAppearance);
  }

  createDatafield(): DataVariable {
    const datafield = super.createDatafield();
    datafield.init = String(this.initialValue);
    datafield.type = 'number';
    return datafield;
  }
}
