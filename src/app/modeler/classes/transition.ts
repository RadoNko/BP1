import {Trigger} from './trigger';
import {RoleRef} from './role-ref';
import {DataRef} from './data-ref';
import {DataGroup} from './datagroup';
import {Event} from './event';
import {ObjectElement} from './object-element';
import {ModelerConfig} from '../modeler-config';
import {GridsterDataField} from '../../form-builder/gridster/classes/gridster-data-field';
import {Activable} from './activable';

export enum AssignPolicy {
  auto = 'auto',
  manual = 'manual'
}

export enum FinishPolicy {
  autoNoData = 'auto_no_data',
  manual = 'manual'
}

export class Transition implements Activable {
  type: string;
  id: string;
  index: number;
  x: number;
  y: number;
  velkost: any;
  label: string;
  over: number;
  objektyelementu: ObjectElement;
  firing: boolean;
  cols: number;
  offset: number;
  heatMapFlag: boolean;
  activationCount : number;

  data: GridsterDataField[];

  icon: string;
  priority: string;
  assignPolicy: AssignPolicy;
  dataFocusPolicy: string;
  finishPolicy: FinishPolicy;
  triggers: Trigger[];
  transactionRef: string;
  roleRefs: RoleRef[];
  dataRefs: DataRef[];
  dataGroups: DataGroup[];
  events: Event[];

  constructor(x: number, y: number, id: string) {
    this.type = 'transition';
    this.id = id;
    this.index = 0;
    this.x = x;
    this.y = y;
    this.velkost = ModelerConfig.SIZE;
    this.label = '';
    this.over = 1;
    this.data = [];
    this.icon = '';
    this.priority = '';
    this.assignPolicy = AssignPolicy.manual;
    this.dataFocusPolicy = '';
    this.finishPolicy = FinishPolicy.manual;
    this.triggers = [];
    this.transactionRef = '';
    this.roleRefs = [];
    this.dataRefs = [];
    this.dataGroups = [];
    this.events = [];
    this.offset = 0;
    this.heatMapFlag = false;
    this.activationCount = 0;
  }

  activate(): void {
    if (this.objektyelementu !== undefined) {
      if (this.heatMapFlag == false){
        this.objektyelementu.element.setAttributeNS(null, 'class', 'svg-active-stroke');
        this.objektyelementu.menoelem.setAttributeNS(null, 'class', 'svg-active-fill');
        this.objektyelementu.cancelArrow.setAttributeNS(null, 'class', 'svg-fire-arrow-cancel-active');
        this.objektyelementu.finishArrow.setAttributeNS(null, 'class', 'svg-fire-arrow-finish-active');
      }
      else {
        //this.objektyelementu.element.setAttributeNS(null, 'class', 'svg-active-stroke');
        this.objektyelementu.menoelem.setAttributeNS(null, 'class', 'svg-active-fill');
        this.objektyelementu.cancelArrow.setAttributeNS(null, 'class', 'svg-fire-arrow-cancel-active');
        this.objektyelementu.finishArrow.setAttributeNS(null, 'class', 'svg-fire-arrow-finish-active');
      }

    }
    this.over = 1;
  }

  deactivate(): void {
    if (this.objektyelementu !== undefined) {
      if (this.heatMapFlag == false){
        this.objektyelementu.element.setAttributeNS(null, 'class', 'svg-inactive-stroke');
        this.objektyelementu.element.setAttributeNS(null, 'fill', 'white');
        this.objektyelementu.element.setAttributeNS(null, 'stroke-width', '2');
        this.objektyelementu.menoelem.setAttributeNS(null, 'class', 'svg-inactive-fill');
        this.objektyelementu.cancelArrow.setAttributeNS(null, 'class', 'svg-fire-arrow-cancel-inactive');
        this.objektyelementu.finishArrow.setAttributeNS(null, 'class', 'svg-fire-arrow-finish-inactive');
      }
      else {
        //this.objektyelementu.element.setAttributeNS(null, 'class', 'svg-inactive-stroke');
        //this.objektyelementu.element.setAttributeNS(null, 'fill', 'white');
        this.objektyelementu.element.setAttributeNS(null, 'stroke-width', '2');
        this.objektyelementu.menoelem.setAttributeNS(null, 'class', 'svg-inactive-fill');
        this.objektyelementu.cancelArrow.setAttributeNS(null, 'class', 'svg-fire-arrow-cancel-inactive');
        this.objektyelementu.finishArrow.setAttributeNS(null, 'class', 'svg-fire-arrow-finish-inactive');
      }
    }
    this.over = 0;
  }

  enable(): void {
    if (this.objektyelementu !== undefined) {
      if (this.firing) {
        this.objektyelementu.element.setAttributeNS(null, 'class', 'svg-transition-firing');
        this.objektyelementu.cancelArrow.setAttributeNS(null, 'class', 'svg-fire-arrow-cancel-active');
        this.objektyelementu.finishArrow.setAttributeNS(null, 'class', 'svg-fire-arrow-finish-active');
        this.objektyelementu.icon?.setAttributeNS(null, 'class', 'svg-icon-inactive');
      } else {
        this.objektyelementu.element.setAttributeNS(null, 'class', 'svg-transition-enabled');
        this.objektyelementu.cancelArrow.setAttributeNS(null, 'class', 'svg-fire-arrow-cancel-inactive');
        this.objektyelementu.finishArrow.setAttributeNS(null, 'class', 'svg-fire-arrow-finish-inactive');
        this.objektyelementu.icon?.setAttributeNS(null, 'class', 'svg-icon-active');
      }
    }
  }

  disable(): void {
    if (this.objektyelementu !== undefined) {
      this.objektyelementu.element.setAttributeNS(null, 'class', 'svg-transition-disabled');
      if (this.firing) {
        this.objektyelementu.cancelArrow.setAttributeNS(null, 'class', 'svg-fire-arrow-cancel-active');
        this.objektyelementu.finishArrow.setAttributeNS(null, 'class', 'svg-fire-arrow-finish-active');
        this.objektyelementu.icon?.setAttributeNS(null, 'class', 'svg-icon-inactive');
      } else {
        this.objektyelementu.cancelArrow.setAttributeNS(null, 'class', 'svg-fire-arrow-cancel-inactive');
        this.objektyelementu.finishArrow.setAttributeNS(null, 'class', 'svg-fire-arrow-finish-inactive');
        this.objektyelementu.icon?.setAttributeNS(null, 'class', 'svg-icon-active');
      }
    }
  }

  set stringX(value: string) {
    this.x = +value;
  }

  set stringY(value: string) {
    this.y = +value;
  }

  get numCols() {
    return this.cols === undefined ? 4 : this.cols;
  }

  clone(): Transition {
    const trans = new Transition(this.x, this.y, this.id);
    trans.label = this.label;
    trans.index = this.index;
    trans.velkost = this.velkost;
    trans.over = this.over;
    trans.objektyelementu = this.objektyelementu === undefined ? undefined : {...this.objektyelementu};
    trans.icon = this.icon;
    trans.priority = this.priority;
    trans.assignPolicy = this.assignPolicy;
    trans.dataFocusPolicy = this.dataFocusPolicy;
    trans.finishPolicy = this.finishPolicy;
    // trans.triggers = this.triggers.map(item => item.clone());
    trans.transactionRef = this.transactionRef;
    trans.roleRefs = this.roleRefs.map(item => item.clone());
    trans.dataRefs = this.dataRefs.map(item => item.clone());
    // trans.dataGroups = this.dataGroups.map( item => item.clone());
    trans.events = this.events.map(item => item.clone());
    trans.offset = this.offset;
    trans.heatMapFlag = this.heatMapFlag;
    trans.activationCount = this.activationCount;
    return trans;
  }
}
