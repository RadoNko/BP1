import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {Trigger} from '../../../classes/trigger';
import {NGX_MAT_DATE_FORMATS} from '@angular-material-components/datetime-picker';
import {DATE_TIME_FORMAT} from '../../../../form-builder/data-field/datetime-field/time-formats';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {MatSidenav} from '@angular/material/sidenav';

interface TriggerNode {
  name?: string;
  trigger?: TriggerNode[];
  type?: string;
  option?: string;
  exact?: Date;
  delay?: number;
}

@Component({
  selector: 'nab-trigger-tree',
  templateUrl: './trigger-tree.component.html',
  styleUrls: ['./trigger-tree.component.scss'],
  providers: [
    {provide: NGX_MAT_DATE_FORMATS, useValue: DATE_TIME_FORMAT}
  ]
})
export class TriggerTreeComponent implements OnInit {
  @Input() nav: MatSidenav;
  @Input() triggers: Trigger[];
  @Output() changeTriggers = new EventEmitter<Trigger[]>();

  typeOptions = [{key: 'auto', value: 'Auto'}, {key: 'user', value: 'User'}, {key: 'time', value: 'Time'}];
  optionOptions = [{key: 'exact', value: 'Exact'}, {key: 'delay', value: 'Delay'}];

  treeData: TriggerNode[];

  counter: number;

  treeControl = new NestedTreeControl<TriggerNode>(node => node.trigger);

  dataSource = new MatTreeNestedDataSource<TriggerNode>();

  constructor() {
    this.treeData = [{
      name: 'Triggers',
      trigger: []
    }];
    this.dataSource.data = this.treeData;
    this.counter = 0;
  }

  ngOnInit(): void {
    this.nav.openedStart.subscribe(  () => {
      this.import();
    });
  }

  import(): void {
    this.counter = 0;
    const tree = [{
      name: 'Triggers',
      trigger: []
    }];
    this.dataSource.data = tree;
    this.triggers.forEach(item => {
      const newNode = {
        name: this.createId(),
        trigger: [{
          type: item.type,
          option: item.delay === undefined  ? 'exact' : 'delay',
          exact: item.exact,
          delay: item.delay,
        }]
      };
      tree[0].trigger.push(newNode as TriggerNode);
    });
    this.dataSource.data = tree;
    this.refreshTree();
    this.treeControl.expand(tree[0]);
  }

  private createId() {
    this.counter++;
    if (this.dataSource.data[0].trigger.find(item => item.name === 'Trigger_' + this.counter)) {
      return this.createId();
    } else {
      return 'Trigger_' + String(this.counter);
    }
  }

  hasChildAndNotRoot = (_: number, node: TriggerNode) => !!node.trigger && node.trigger.length > 0 && node.name !== 'Triggers';

  isRoot = (_: number, node: TriggerNode) => node.name === 'Triggers';

  refreshTree() {
    const _data = this.dataSource.data;
    this.dataSource.data = null;
    this.dataSource.data = _data;
  }

  emitChanges() {
    const triggers = [];
    this.dataSource.data[0].trigger.forEach(item => {
      triggers.push({
        type: item.trigger[0].type,
        exact: item.trigger[0].exact,
        delay: item.trigger[0].delay
      } as Trigger);
    });
    this.changeTriggers.emit(triggers);
  }

  addNewItem(node: TriggerNode) {
    if (!node.trigger) {
      node.trigger = [];
    }
    const newNode = {
      name: this.createId(),
      trigger: [{
        type: 'auto',
        option: 'exact',
        exact: new Date(),
        delay: undefined
      }]
    };
    node.trigger.push(newNode as TriggerNode);
    this.refreshTree();
    this.emitChanges();
    this.treeControl.expand(node);
    this.treeControl.expand(newNode);
  }

  removeItem(node: TriggerNode) {
    const ind = this.dataSource.data[0].trigger.indexOf(node);
    this.dataSource.data[0].trigger.splice(ind, 1);
    this.refreshTree();
    this.emitChanges();
  }

  makeChangeOption($event, node) {
    if ($event.value === 'exact') {
      node.exact = new Date();
      node.delay = undefined;
    } else if ($event.value === 'delay') {
      node.delay = 0;
      node.exact = undefined;
    }
    this.emitChanges();
  }
}
