import {ObjectPlace} from './object-place';
import {ModelerConfig} from '../modeler-config';
import {Activable} from './activable';

export class Place implements Activable {

  public static layouts = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  private _type: string;
  private _static: any;
  private _id: string;
  private _index: number;
  private _x: number;
  private _y: number;
  private _polomer: any;
  private _label: string;
  private _over: number;
  private _marking: number;
  private _testmarking: number;
  private _markinglabel: string;
  private _markingtokens: [];
  private _objektymiesta: ObjectPlace;

  constructor(x: number, y: number, isStatic: boolean, id: string) {
    this._type = 'place';
    this._static = isStatic;
    this._id = id;
    this._index = 0;
    this._x = x;
    this._y = y;
    this._polomer = ModelerConfig.RADIUS;
    this._label = '';
    this._over = 1;
    this._marking = 0;
    this._testmarking = 0;
    this._markinglabel = '';
    this._markingtokens = [];
  }

  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
  }

  get static(): any {
    return this._static;
  }

  set static(value: any) {
    this._static = value;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get index(): number {
    return this._index;
  }

  set index(value: number) {
    this._index = value;
  }

  get x(): any {
    return this._x;
  }

  set x(value: any) {
    this._x = value;
  }

  get y(): any {
    return this._y;
  }

  set y(value: any) {
    this._y = value;
  }

  get polomer(): any {
    return this._polomer;
  }

  set polomer(value: any) {
    this._polomer = value;
  }

  get label(): string {
    return this._label;
  }

  set label(value: string) {
    this._label = value;
  }

  get over(): number {
    return this._over;
  }

  set over(value: number) {
    this._over = value;
  }

  get marking(): number {
    return this._marking;
  }

  set marking(value: number) {
    this._marking = value;
  }

  get testmarking(): number {
    return this._testmarking;
  }

  set testmarking(value: number) {
    this._testmarking = value;
  }

  get markinglabel(): string {
    return this._markinglabel;
  }

  set markinglabel(value: string) {
    this._markinglabel = value;
  }

  get markingtokens(): [] {
    return this._markingtokens;
  }

  set markingtokens(value: []) {
    this._markingtokens = value;
  }

  get objektymiesta(): ObjectPlace {
    return this._objektymiesta;
  }

  set objektymiesta(value: ObjectPlace) {
    this._objektymiesta = value;
  }

  activate() {
    if (this.objektymiesta !== undefined) {
      this.objektymiesta.element.setAttributeNS(null, 'class', 'svg-active-stroke');
      this.objektymiesta.menoelem.setAttributeNS(null, 'class', 'svg-active-fill');
    }
    this.over = 1;
  }

  deactivate() {
    if (this.objektymiesta !== undefined) {
      this.objektymiesta.element.setAttributeNS(null, 'class', 'svg-inactive-stroke');
      this.objektymiesta.menoelem.setAttributeNS(null, 'class', 'svg-inactive-fill');
      this.objektymiesta.element.setAttributeNS(null, 'fill', 'white');
      if (this.static) {
        this.objektymiesta.element.setAttributeNS(null, 'stroke-dasharray', '14, 5');
        this.objektymiesta.element.setAttributeNS(null, 'stroke-width', '3');
      } else {
        this.objektymiesta.element.setAttributeNS(null, 'stroke-width', '2');
      }
    }
    this.over = 0;
  }

  clone(): Place {
    const place = new Place(this.x, this.y, this.static, this.id);
    place.type = this.type;
    place.index = this.index;
    place.polomer = this.polomer;
    place.label = this.label;
    place.over = this.over;
    place.marking = this.marking;
    place.markinglabel = this.markinglabel;
    place.markingtokens = [...this.markingtokens] as any;
    place.objektymiesta = this.objektymiesta === undefined ? undefined : {...this.objektymiesta};
    place.testmarking = this.testmarking;
    return place;
  }
}
