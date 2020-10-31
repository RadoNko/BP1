export class Action {
  trigger: any;
  definition: string;
  id: any;

  constructor(id, trigger, definition) {
    this.trigger = trigger;
    this.definition = definition;
    this.id = id;
  }

  toXml() {
    let xml = '<action';
    if (this.id !== undefined && this.id != null && this.id !== '') {
      xml += ' id="' + this.id + '"';
    }
    if (this.trigger !== undefined && this.trigger != null) {
      xml += ' trigger="' + this.trigger + '"';
    }
    xml += '>' + this.escape(this.definition) + '</action>\n';
    return xml;
  }

  clone(): Action {
    return new Action(this.id, this.trigger, this.definition);
  }

  private escape(action: string) {
    return action.replace(/&/g, '&amp;')
      .replace(/<(?!!--)/g, '&lt;')
      .split('').reverse().join('')
      .replace(/>(?!(--))/g, '&gt;')
      .split('').reverse().join('');
  }
}
