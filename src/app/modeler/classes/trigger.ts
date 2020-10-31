export class Trigger {
  type: string;
  delay: number;
  exact: Date;

  constructor() {
    this.type = '';
    this.delay = 0;
    this.exact = new Date();
  }

  clone(): Trigger {
    const trig = new Trigger();
    trig.type = this.type;
    trig.delay = this.delay;
    trig.exact = this.exact;
    return trig;
  }
}
