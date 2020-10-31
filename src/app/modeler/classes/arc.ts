import {ObjectArc} from './object-arc';
import {ModelerConfig} from '../modeler-config';
import {Point} from './point';
import {Activable} from './activable';

export class Arc implements Activable {

  type: string;
  arctype: any;
  id: any;
  source: any;
  target: any;
  vaha: any;
  vahalabel: any;
  bodyhrany: any;
  objektyhrany: ObjectArc;
  dataref: any;
  placeref: any;
  cancel: any;

  constructor(source, target, arctype, id: string) {
    this.type = 'arc';
    this.arctype = arctype;
    this.id = id;
    this.source = source;
    this.target = target;
    this.vaha = 1;
    this.vahalabel = '';
    this.dataref = false;
    this.placeref = false;
    this.bodyhrany = Arc.prvebodyhrany(source, target);
  }

  public static koniec_hrany(startElement, endElement) {
    const startPointX = startElement.x;
    const startPointY = startElement.y;
    const endPointX = endElement.x;
    const endPointY = endElement.y;
    const dx = endPointX - startPointX;
    const dy = endPointY - startPointY;

    const dlzkaHrany = Math.sqrt(dx * dx + dy * dy);
    const pdx = ModelerConfig.RADIUS * dx / dlzkaHrany;
    const pdy = ModelerConfig.RADIUS * dy / dlzkaHrany;

    let tdx: number;
    if (dx * dx >= dy * dy) {
      tdx = ModelerConfig.SIZE / 2;
    } else {
      tdx = (ModelerConfig.SIZE / 2) * (dx / dy);
    }
    let tdy: number;
    if (dx * dx >= dy * dy) {
      tdy = (ModelerConfig.SIZE / 2) * (dy / dx);
    } else {
      tdy = ModelerConfig.SIZE / 2;
    }

    if (endElement.type === 'transition') {
      let tnovex: number;
      let tnovey: number;
      if ((dx * dx >= dy * dy && dx >= 0) || (dx * dx < dy * dy && dy >= 0)) {
        tnovex = endPointX - tdx;
        tnovey = endPointY - tdy;
      } else {
        tnovex = endPointX + tdx;
        tnovey = endPointY + tdy;
      }
      if (isNaN(tnovex)) {
        tnovex = startPointX;
      }
      if (isNaN(tnovey)) {
        tnovey = startPointY;
      }
      return new Point(tnovex, tnovey);
    }

    if (endElement.type === 'place') {
      let tnovex = endPointX - pdx;
      let tnovey = endPointY - pdy;
      if (isNaN(tnovex)) {
        tnovex = startPointX;
      }
      if (isNaN(tnovey)) {
        tnovey = startPointY;
      }
      return new Point(tnovex, tnovey);
    }
  }

  public static zaciatok_hrany(startElement, endElement) {
    const startPointX = startElement.x;
    const startPointY = startElement.y;
    const endPointX = endElement.x;
    const endPointY = endElement.y;
    const dx = endPointX - startPointX;
    const dy = endPointY - startPointY;

    const dlzkaHrany = Math.sqrt(dx * dx + dy * dy);
    const pdx = ModelerConfig.RADIUS * dx / dlzkaHrany;
    const pdy = ModelerConfig.RADIUS * dy / dlzkaHrany;

    let tdx: number;
    if (dx * dx >= dy * dy) {
      tdx = ModelerConfig.SIZE / 2;
    } else {
      tdx = (ModelerConfig.SIZE / 2) * (dx / dy);
    }
    let tdy: number;
    if (dx * dx >= dy * dy) {
      tdy = (ModelerConfig.SIZE / 2) * (dy / dx);
    } else {
      tdy = ModelerConfig.SIZE / 2;
    }

    if (startElement.type === 'place') {
      let snovex = startPointX + pdx;
      let snovey = startPointY + pdy;
      if (isNaN(snovex)) {
        snovex = startPointX;
      }
      if (isNaN(snovey)) {
        snovey = startPointY;
      }
      return new Point(snovex, snovey);
    }

    if (startElement.type === 'transition') {
      let snovex: number;
      let snovey: number;
      if ((dx * dx >= dy * dy && dx >= 0) || (dx * dx < dy * dy && dy >= 0)) {
        snovex = startPointX + tdx;
        snovey = startPointY + tdy;
      } else {
        snovex = startPointX - tdx;
        snovey = startPointY - tdy;
      }
      if (isNaN(snovex)) {
        snovex = startPointX;
      }
      if (isNaN(snovey)) {
        snovey = startPointY;
      }
      return new Point(snovex, snovey);
    }
  }

  public static prvebodyhrany(source, target) {
    const polebodov = [];
    polebodov[0] = Arc.zaciatok_hrany(source, target);
    polebodov[1] = Arc.koniec_hrany(source, target);
    return polebodov;
  }

  activate(): void {
    if (this.objektyhrany !== undefined) {
      this.objektyhrany.polyciara.setAttributeNS(null, 'class', 'svg-active-stroke');
      if (this.arctype === 'inhibitor') {
        this.objektyhrany.sipka.setAttributeNS(null, 'class', 'svg-invisible-fill svg-active-stroke');
      } else {
        this.objektyhrany.sipka.setAttributeNS(null, 'class', 'svg-active-fill svg-active-stroke');
      }
      this.objektyhrany.vahaelem.setAttributeNS(null, 'class', 'svg-active-fill');
    }
  }

  deactivate(): void {
    if (this.objektyhrany !== undefined) {
      this.objektyhrany.polyciara.setAttributeNS(null, 'class', 'svg-inactive-stroke');
      if (this.arctype === 'inhibitor') {
        this.objektyhrany.sipka.setAttributeNS(null, 'class', 'svg-invisible-fill svg-inactive-stroke');
      } else {
        this.objektyhrany.sipka.setAttributeNS(null, 'class', 'svg-inactive-fill svg-inactive-stroke');
      }
      this.objektyhrany.vahaelem.setAttributeNS(null, 'class', 'svg-inactive-fill');
    }
  }

  clone(trans, places): Arc {
    let source;
    if (this.source.type === 'transition') {
      if (trans.has(this.source.id)) {
        source = trans.get(this.source.id);
      } else {
        console.log('Source dont existing on Arc n. ' + this.id);
        source = this.source;
      }
    } else if (this.source.type === 'place') {
      if (places.has(this.source.id)) {
        source = places.get(this.source.id);
      } else {
        console.log('Source dont existing on Arc n. ' + this.id);
        source = this.source;
      }
    }

    let target;
    if (this.target.type === 'transition') {
      if (trans.has(this.target.id)) {
        target = trans.get(this.target.id);
      } else {
        console.log('Target dont existing on Arc n. ' + this.id);
        target = this.target;
      }
    } else if (this.target.type === 'place') {
      if (places.has(this.target.id)) {
        target = places.get(this.target.id);
      } else {
        console.log('Target dont existing on Arc n. ' + this.id);
        target = this.target;
      }
    }

    const arc = new Arc(source, target, this.arctype, this.id);
    arc.type = this.type;
    arc.vaha = this.vaha;
    arc.vahalabel = this.vahalabel;
    arc.dataref = this.dataref;
    arc.placeref = this.placeref;
    arc.bodyhrany = this.bodyhrany;
    arc.objektyhrany = this.objektyhrany === undefined ? undefined : {...this.objektyhrany};
    return arc;
  }
}
