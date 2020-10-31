import {DataVariable} from './data-variable';
import {Transaction} from './transaction';
import {Role} from './role';
import {Arc} from './arc';
import {Place} from './place';
import {Transition} from './transition';
import {I18nTranslations} from './i18n-translations';

export class Model {
  private _transitions: Transition[];
  private _places: Place[];
  private _arcs: Arc[];
  private _processData: DataVariable[];
  private _transactions: Transaction[];
  private _roles: Role[];
  // tslint:disable-next-line:variable-name
  private _arc_for_data;
  private _id: string;
  private _identifier: string;
  private _version: string;
  private _initials: string;
  private _title: string;
  private _description: string;
  private _icon: string;
  private _defaultRole: boolean;
  private _transitionRole: boolean;
  private _caseName: string;
  private _file: string;
  private _fileName: string;
  private _i18ns: Array<I18nTranslations>;

  constructor() {
    this._transitions = [];
    this._places = [];
    this._arcs = [];
    this._processData = [];
    this._transactions = [];
    this._roles = [];
    this._id = 'new_model';
    this._identifier = 'newmodel';
    this._version = '';
    this._initials = 'NEW';
    this._title = 'New Model';
    this._icon = '';
    this._defaultRole = true;
    this._transitionRole = false;
    this._caseName = '';
    this._file = '';
    this._description = '';
    this._fileName = 'newmodel.xml';
    this._i18ns = [];
  }

  get transitions(): Transition[] {
    return this._transitions;
  }

  set transitions(value: Transition[]) {
    this._transitions = value;
  }

  get places(): Place[] {
    return this._places;
  }

  set places(value: Place[]) {
    this._places = value;
  }

  get arcs(): Arc[] {
    return this._arcs;
  }

  set arcs(value: Arc[]) {
    this._arcs = value;
  }

  get processData(): DataVariable[] {
    return this._processData;
  }

  set processData(value: DataVariable[]) {
    this._processData = value;
  }

  get transactions(): Transaction[] {
    return this._transactions;
  }

  set transactions(value: Transaction[]) {
    this._transactions = value;
  }

  get roles(): Role[] {
    return this._roles;
  }

  set roles(value: Role[]) {
    this._roles = value;
  }

  get arc_for_data() {
    return this._arc_for_data;
  }

  set arc_for_data(value) {
    this._arc_for_data = value;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get identifier(): string {
    return this._identifier;
  }

  set identifier(value: string) {
    this._identifier = value;
  }

  get version(): string {
    return this._version;
  }

  set version(value: string) {
    this._version = value;
  }

  get initials(): string {
    return this._initials;
  }

  set initials(value: string) {
    this._initials = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get icon(): string {
    return this._icon;
  }

  set icon(value: string) {
    this._icon = value;
  }

  get defaultRole(): boolean {
    return this._defaultRole;
  }

  set defaultRole(value: boolean) {
    this._defaultRole = value;
  }

  get transitionRole(): boolean {
    return this._transitionRole;
  }

  set transitionRole(value: boolean) {
    this._transitionRole = value;
  }

  get caseName(): string {
    return this._caseName;
  }

  set caseName(value: string) {
    this._caseName = value;
  }

  get file(): string {
    return this._file;
  }

  set file(value: string) {
    this._file = value;
  }

  get fileName(): string {
    return this._fileName;
  }

  set fileName(value: string) {
    this._fileName = value;
  }

  get i18ns(): Array<I18nTranslations> {
    return this._i18ns;
  }

  set i18ns(value: Array<I18nTranslations>) {
    this._i18ns = value;
  }

  clone(): Model {
    const model = new Model();
    model.transitions = this.transitions.map(item => item.clone());
    model.places = this.places.map(item => item.clone());

    const trans = new Map<string, Transition>();
    model.transitions.forEach(item => trans.set(item.id, item));
    const places = new Map<string, Place>();
    model.places.forEach(item => places.set(item.id, item));

    model.arcs = this.arcs.map(item => item.clone(trans, places));
    model.processData = this.processData.map(item => item.clone());
    model.transactions = this.transactions.map(item => item.clone());
    model.roles = this.roles.map(item => item.clone());
    model.arc_for_data = this.arc_for_data;
    model.id = this.id;
    model.identifier = this.identifier;
    model.version = this.version;
    model.initials = this.initials;
    model.title = this.title;
    model.description = this.description;
    model.icon = this.icon;
    model.defaultRole = this.defaultRole;
    model.transitionRole = this.transitionRole;
    model.caseName = this.caseName;
    model.file = this.file;
    model.fileName = this.fileName;
    model.i18ns = this.i18ns.map(item => item.clone());
    return model;
  }

}
