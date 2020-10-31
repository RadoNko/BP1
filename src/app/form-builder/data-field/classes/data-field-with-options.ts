import {DataFieldObject} from './data-field-object';
import {DataVariable} from '../../../modeler/classes/data-variable';

export abstract class DataFieldWithOptions<T> extends DataFieldObject<T> {

  constructor(
    id: string,
    title: string,
    value: T,
    public options: Array<string>,
    usesSplitTemplate: boolean,
    behavior: string[],
    offset: number,
    placeholder?: string,
    hint?: string,
    materialAppearance?: string) {
    super(id, title, value, usesSplitTemplate, behavior, offset, placeholder, hint, materialAppearance);
  }

  createDatafield(): DataVariable {
    const datafield = super.createDatafield();
    // TODO save as key-value pair in the transition once maps are supported
    datafield.values = this.options;
    return datafield;
  }
}
