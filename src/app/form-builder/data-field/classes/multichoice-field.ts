import {DataFieldWithOptions} from './data-field-with-options';
import {DataVariable, DataView} from '../../../modeler/classes/data-variable';

export enum MultichoiceFieldTypes {
  SELECT,
  LIST
}

export class MultichoiceField extends DataFieldWithOptions<Array<string>> {

  constructor(
    id: string,
    title: string,
    initialValue: Array<string>,
    options: Array<string>,
    usesSplitTemplate: boolean,
    behavior: string[],
    offset: number,
    placeholder: string,
    hint: string,
    materialAppearance: string,
    public type: MultichoiceFieldTypes
  ) {
    super(id, title, initialValue, options, usesSplitTemplate, behavior, offset, placeholder, hint, materialAppearance);
  }

  createDatafield(): DataVariable {
    const datafield = super.createDatafield();
    datafield.type = 'multichoice';
    datafield.init = this.initialValue.join(', ');
    if (this.type === MultichoiceFieldTypes.LIST) {
      datafield.view = DataView.LIST;
    }
    return datafield;
  }
}
