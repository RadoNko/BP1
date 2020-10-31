import {DataVariable} from '../../../modeler/classes/data-variable';
export abstract class DataFieldObject<T> {

  protected constructor(
    public id: string,
    public title: string,
    public initialValue: T,
    public usesSplitTemplate: boolean,
    public behavior: string[],
    public offset: number,
    public placeholder?: string,
    public hint?: string,
    public materialAppearance?: string
  ) {
  }

  public createDatafield(): DataVariable {
    const dataField = new DataVariable(this.id);
    dataField.name = this.title;
    dataField.placeholder = this.placeholder;
    dataField.desc = this.hint;
    // TODO save usesSplitTemplate and materialAppearance attributes
    return dataField;
  }

}
