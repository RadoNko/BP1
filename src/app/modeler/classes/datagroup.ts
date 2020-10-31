import {DataRef} from './data-ref';

export class DataGroup {
  id: any;
  title: string;
  alignment: string;
  stretch: string;
  dataRefs: DataRef[];

  constructor(id) {
    this.id = id;
    this.title = '';
    this.alignment = '';
    this.stretch = '';
    this.dataRefs = [];
  }

  clone(): DataGroup {
    const datagroup = new DataGroup(this.id);
    datagroup.title = this.title;
    datagroup.alignment = this.alignment;
    datagroup.stretch = this.stretch;
    datagroup.dataRefs = this.dataRefs.map(item => item.clone());
    return datagroup;
  }
}
