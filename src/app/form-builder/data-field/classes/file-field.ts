import {DataFieldObject} from './data-field-object';
import {DataVariable} from '../../../modeler/classes/data-variable';

export enum FileFieldTypes {
  SIMPLE
}

export class FileField extends DataFieldObject<File> {

  constructor(
    id: string,
    title: string,
    usesSplitTemplate: boolean,
    behavior: string[],
    offset: number,
    placeholder: string,
    public type: FileFieldTypes
  ) {
    super(id, title, undefined, usesSplitTemplate, behavior, offset, placeholder, undefined);
  }

  createDatafield(): DataVariable {
    const datafield = super.createDatafield();
    // datafield.init = undefined; TODO:uncomment when date will has initial value
    datafield.type = 'file';
    return datafield;
  }
}
