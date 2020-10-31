import {DataFieldObject} from './data-field-object';
import {DataVariable} from '../../../modeler/classes/data-variable';

export enum FileListFieldTypes {
  SIMPLE
}

export class FileListField extends DataFieldObject<File> {
  constructor(
    id: string,
    title: string,
    usesSplitTemplate: boolean,
    behavior: string[],
    offset: number,
    placeholder: string,
    public type: FileListFieldTypes
  ) {
    super(id, title, undefined, usesSplitTemplate, behavior, offset, placeholder, undefined);
  }

  createDatafield(): DataVariable {
    const datafield = super.createDatafield();
    datafield.type = 'fileList';
    return datafield;
  }
}
