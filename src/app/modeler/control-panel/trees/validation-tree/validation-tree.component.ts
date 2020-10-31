import {AfterViewInit, Component, EventEmitter, Output} from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {Validation} from '../../../classes/validation';
import {DataModeService} from '../../../data-mode/data-mode.service';
import {MatTreeNestedDataSource} from '@angular/material/tree';

interface ValidationNode {
  name?: string;
  validation?: ValidationNode[];
  expression?: string;
  message?: string;
}

@Component({
  selector: 'nab-validation-tree',
  templateUrl: './validation-tree.component.html',
  styleUrls: ['./validation-tree.component.scss']
})
export class ValidationTreeComponent implements AfterViewInit {
  @Output() changeValidations = new EventEmitter<Validation[]>();

  treeData: ValidationNode[];

  counter: number;

  treeControl = new NestedTreeControl<ValidationNode>(node => node.validation);

  dataSource = new MatTreeNestedDataSource<ValidationNode>();

  constructor(private dataService: DataModeService) {
    this.treeData = [{
      name: 'Validations',
      validation: []
    }];
    this.dataSource.data = this.treeData;
    this.counter = 0;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataService.itemData.subscribe(obj => this.import(obj.validations));
    });
  }

  private import(validations) {
    this.counter = 0;
    const tree = [{
      name: 'Validations',
      validation: []
    }];
    this.dataSource.data = tree;
    validations.forEach(item => {
      const newNode = {
        name: this.createId(),
        validation: [{
          expression: item.expression,
          message: item.message
        }]
      };
      tree[0].validation.push(newNode as ValidationNode);
    });
    this.dataSource.data = tree;
    this.refreshTree();
    this.treeControl.expand(tree[0]);
  }

  private createId() {
    this.counter++;
    if (this.dataSource.data[0].validation.find(item => item.name === 'Validation_' + this.counter)) {
      return this.createId();
    } else {
      return 'Validation_' + String(this.counter);
    }
  }

  hasChildAndNotRoot = (_: number, node: ValidationNode) => !!node.validation && node.validation.length > 0 && node.name !== 'Validations';

  isRoot = (_: number, node: ValidationNode) => node.name === 'Validations';

  addNewItem(node: ValidationNode) {
    if (!node.validation) {
      node.validation = [];
    }
    const newNode = {
      name: this.createId(),
      validation: [{
        expression: '',
        message: ''
      }]
    };
    node.validation.push(newNode as ValidationNode);
    this.refreshTree();
    this.emitChanges();
    this.treeControl.expand(node);
    this.treeControl.expand(newNode);
  }

  refreshTree() {
    const _data = this.dataSource.data;
    this.dataSource.data = null;
    this.dataSource.data = _data;
  }

  removeNewItem(node: any) {
    const ind = this.dataSource.data[0].validation.indexOf(node);
    this.dataSource.data[0].validation.splice(ind, 1);
    this.refreshTree();
    this.emitChanges();
  }

  emitChanges() {
    const valid = [];
    this.dataSource.data[0].validation.forEach(item => {
      valid.push({expression: item.validation[0].expression, message: item.validation[0].message} as Validation);
    });
    this.changeValidations.emit(valid);
  }
}
