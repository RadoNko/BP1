import {Action} from './action';

export class Event {
  id: string;
  type: string;
  message: string;
  title: string;
  preactions: Action[];
  postactions: Action[];

  constructor() {
    this.id = '';
    this.type = '';
    this.message = '';
    this.title = '';
    this.preactions = [];
    this.postactions = [];
  }

  clone(): Event {
    const event = new Event();
    event.id = this.id;
    event.type = this.type;
    event.message = this.message;
    event.title = this.title;
    event.preactions = this.preactions.map(item => item.clone());
    event.postactions = this.postactions.map(item => item.clone());
    return event;
  }
}
