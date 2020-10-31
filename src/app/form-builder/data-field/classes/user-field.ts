import {DataVariable} from '../../../modeler/classes/data-variable';
import {DataFieldObject} from './data-field-object';

export enum UserFieldTypes {
  SIMPLE
}

export class UserField extends DataFieldObject<string> {

  constructor(
    id: string,
    title: string,
    usesSplitTemplate: boolean,
    behavior: string[],
    offset: number,
    placeholder: string,
    hint: string,
    materialAppearance: string,
    public type: UserFieldTypes
  ) {
    super(id, title, undefined, usesSplitTemplate, behavior, offset, placeholder, hint, materialAppearance);
  }

  createDatafield(): DataVariable {
    const datafield = super.createDatafield();
    // datafield.init = undefined; TODO:uncomment when user will has initial value
    datafield.type = 'user';
    return datafield;
  }
}
