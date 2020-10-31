import {DataFieldWithOptions} from './data-field-with-options';
import {DataVariable, DataView} from '../../../modeler/classes/data-variable';

export enum EnumerationFieldTypes {
  SELECT,
  LIST
}

export class EnumerationField extends DataFieldWithOptions<string> {

  constructor(
    id: string,
    title: string,
    initialValue: string,
    options: Array<string>,
    usesSplitTemplate: boolean,
    behavior: string[],
    offset: number,
    placeholder: string,
    hint: string,
    materialAppearance: string,
    public type: EnumerationFieldTypes
  ) {
    super(id, title, initialValue, options, usesSplitTemplate, behavior, offset, placeholder, hint, materialAppearance);
  }

  createDatafield(): DataVariable {
    const datafield = super.createDatafield();
    datafield.type = 'enumeration';
    datafield.init = this.initialValue;
    if (this.type === EnumerationFieldTypes.LIST) {
      datafield.view = DataView.LIST;
    }
    return datafield;
  }
}
