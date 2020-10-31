import {Validation} from './validation';
import {Action} from './action';

export class DataVariable {
  id: any;
  name: string;
  placeholder: string;
  desc: string;
  value: string;
  values: any[];
  immediate: string;
  type: string;
  remote: boolean;
  actionRef: string;
  actions: Action[];
  encryption: boolean;
  init: string;
  valid: string;
  view: DataView;
  validations: Validation[];

  constructor(no) {
    this.id = no;
    this.name = '';
    this.placeholder = '';
    this.desc = '';
    this.value = '';
    this.values = [];
    this.immediate = '';
    this.type = 'text';
    this.actionRef = '';
    this.actions = [];
    this.init = '';
    this.valid = '';
    this.validations = [];
  }

  getEncryption() {
    if (this.encryption === true) {
      return '<encryption>true</encryption>\n';
    }
    return '<encryption algorithm="' + this.encryption + '">true</encryption>\n';
  }

  clone(): DataVariable {
    const data = new DataVariable(this.id);
    data.name = this.name;
    data.placeholder = this.placeholder;
    data.desc = this.desc;
    data.value = this.value;
    data.values = [...this.values];
    data.immediate = this.immediate;
    data.type = this.type;
    data.actions = this.actions.map(item => item.clone());
    data.actionRef = this.actionRef;
    data.encryption = this.encryption;
    data.init = this.init;
    data.valid = this.valid;
    data.view = this.view;
    data.validations = this.validations.map(item => ({...item}));
    return data;
  }
}

export enum DataView {
  AUTOCOMPLETE = 'autocomplete',
  TREE = 'tree',
  IMAGE = 'image',
  EDITOR = 'editor',
  LIST = 'list'
}
