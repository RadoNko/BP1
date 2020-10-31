export class I18nString {
  name: string;
  value: any;

  constructor(value) {
    this.name = '';
    this.value = value;
  }

  toXml(tag) {
    let xml = '<' + tag;
    if (this.name !== '' && this.name !== undefined && this.name !== null) {
      xml += ' name="' + this.name + '"';
    }
    xml += '>' + this.value + '</' + tag + '>\n';
    return xml;
  }
}
