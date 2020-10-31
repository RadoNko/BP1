export class Transaction {
  id: any;
  title: any;

  constructor(id, title) {
    this.id = id;
    this.title = title;
  }

  clone(): Transaction {
    return new Transaction(this.id, this.title);
  }
}
