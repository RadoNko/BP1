import {Action} from './action';

export class DataRef {
  id: string;
  layout: {
    x: number,
    y: number
    cols: number,
    rows: number,
    offset: number,
    template: string,
    appearance: string,
  };
  logic: {
    behaviors: any,
    actions: Action[],
    actionRefs: any
  };

  constructor(id) {
    this.id = id;
    this.logic = {
      behaviors: [],
      actions: [],
      actionRefs: []
    };
    this.layout = undefined;
  }

  clone() {
    const dataref = new DataRef(this.id);
    dataref.logic = {
      behaviors: this.logic.behaviors,
      actions: this.logic.actions.map( item => item.clone()),
      actionRefs: this.logic.actionRefs
    };
    return dataref;
  }
}
