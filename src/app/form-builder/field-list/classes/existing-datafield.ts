import {DataVariable} from '../../../modeler/classes/data-variable';

export class ExistingDatafield {

  title: string;
  placedInForm: boolean;
  datafield: DataVariable;

  constructor(datafield: DataVariable) {
    this.title = datafield.name;
    this.datafield = datafield;
    this.placedInForm = false;
  }
}
