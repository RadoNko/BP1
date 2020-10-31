import {DataFieldObject} from './data-field-object';
import {DataVariable} from '../../../modeler/classes/data-variable';

export enum TaskRefFieldTypes {
  SIMPLE
}

export class TaskRefField extends DataFieldObject<string> {
  constructor(
    id: string,
    title: string,
    initialValue: string,
    usesSplitTemplate: boolean,
    behavior: string[],
    offset: number,
    placeholder: string,
    hint: string,
    materialAppearance: string,
    public type: TaskRefFieldTypes
  ) {
    super(id, title, initialValue, usesSplitTemplate, behavior, offset, placeholder, hint, materialAppearance);
  }

  createDatafield(): DataVariable {
    const datafield = super.createDatafield();
    datafield.init = this.initialValue;
    datafield.type = 'taskRef';
    return datafield;
  }
}
