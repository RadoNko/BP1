import {Component, ViewChild} from '@angular/core';
import {DataVariable} from '../classes/data-variable';
import {ModelService} from '../model.service';
import {DataModeService} from './data-mode.service';
import {Validation} from '../classes/validation';
import {Model} from '../classes/model';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {DialogDeleteComponent} from '../../dialog-delete/dialog-delete.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSort, Sort} from '@angular/material/sort';

export interface TypeArray {
  viewValue: string;
  value: string;
}

@Component({
  selector: 'nab-data-mode',
  templateUrl: './data-mode.component.html',
  styleUrls: ['./data-mode.component.scss']
})
export class DataModeComponent {
  dataSource: DataVariable[];
  length: number;
  pageSize: number;
  pageIndex: number;
  pageSizeOptions: number[] = [10, 20, 50, 100];
  counter: number;
  optionCounter: number;
  clicked = 0;
  selected: DataVariable;

  itemData: DataVariable;
  processData: DataVariable[];

  typeArray: TypeArray[] = [{viewValue: 'Text', value: 'text'}, {viewValue: 'Number', value: 'number'},
    {viewValue: 'Enumeration', value: 'enumeration'}, {viewValue: 'Multichoice', value: 'multichoice'},
    {viewValue: 'File', value: 'file'}, {viewValue: 'File list', value: 'fileList'},
    {viewValue: 'Boolean', value: 'boolean'}, {viewValue: 'Date', value: 'date'},
    {viewValue: 'Datetime', value: 'datetime'}, {viewValue: 'User', value: 'user'},
    {viewValue: 'Task Ref', value: 'taskRef'}, {viewValue: 'Case Ref', value: 'caseRef'}];

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private modelService: ModelService, private dataService: DataModeService, private deleteDialog: MatDialog) {
    setTimeout(() => {
      if (this.modelService.model === undefined) {
        this.modelService.model = new Model();
      }
      this.dataService.event.next();
    });
    this.dataService.event.subscribe(() => {
      this.pageSize = 20;
      this.pageIndex = 0;
      this.processData = [...this.modelService.model.processData];
      this.length = this.processData.length;
      this.dataSource = [...this.processData.slice(0, this.pageSize)];
      this.counter = 0;
      if (this.sort) {
        this.sort.direction = '';
      }
    });
    this.dataService.itemData.subscribe(obj => this.itemData = obj);
  }

  onPageChanged(e) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    const firstCut = e.pageIndex * e.pageSize;
    const secondCut = firstCut + e.pageSize;
    this.dataSource = this.processData.slice(firstCut, secondCut);
  }

  setData(item: DataVariable) {
    this.clicked = 1;
    this.optionCounter = 1;
    this.selected = item;
    this.dataService.itemData.next(item);
  }

  addDataVariable() {
    const data = new DataVariable(this.createId());
    this.processDataVariableInsert(data);
  }

  duplicateDataVariable(event, item) {
    event.stopPropagation();
    const data = item.clone();
    data.id = this.createId();
    this.processDataVariableInsert(data);
    this.setData(data);
  }

  processDataVariableInsert(data) {
    this.modelService.model.processData.push(data);
    this.processData.push(data);
    this.dataSource.push(data);
    this.length = this.processData.length;
    this.pageIndex = Math.ceil(this.processData.length / this.pageSize) - 1;
    this.onCRUDChange();
    this.setData(data);
  }

  private createId() {
    this.counter++;
    if (this.modelService.model.processData.find(item => item.id === 'newVariable_' + this.counter)) {
      return this.createId();
    } else {
      return 'newVariable_' + String(this.counter);
    }
  }

  removeDataVariable(item) {
    this.modelService.model.processData.splice(this.modelService.model.processData.indexOf(item), 1);
    this.processData.splice(this.dataSource.indexOf(item), 1);
    this.dataSource.splice(this.dataSource.indexOf(item), 1);
    this.length = this.modelService.model.processData.length;
    this.clicked = 0;
    this.onCRUDChange();
  }

  onCRUDChange() {
    const firstCut = this.pageIndex * this.pageSize;
    const secondCut = firstCut + this.pageSize;
    this.dataSource = this.processData.slice(firstCut, secondCut);
  }

  saveValidations(valid: Validation[], item) {
    this.modelService.model.processData.find(obj => obj.id === item.id).validations = [...valid];
    this.processData.find(obj => obj.id === item.id).validations = [...valid];
  }

  setValue($event, item: DataVariable, variable: string) {
    switch (variable) {
      case 'id': {
        this.modelService.model.processData.find(obj => obj.id === item.id).id = $event.target.value;
        this.processData.find(obj => obj.id === item.id).id = $event.target.value;
        break;
      }
      case 'name': {
        this.modelService.model.processData.find(obj => obj.id === item.id).name = $event.target.value;
        this.processData.find(obj => obj.id === item.id).name = $event.target.value;
        break;
      }
      case 'value': {
        this.modelService.model.processData.find(obj => obj.id === item.id).value = $event.target.value;
        this.processData.find(obj => obj.id === item.id).value = $event.target.value;
        break;
      }
      case 'type': {
        this.modelService.model.processData.find(obj => obj.id === item.id).type = $event.value;
        this.processData.find(obj => obj.id === item.id).type = $event.value;
        break;
      }
      case 'immediate': {
        this.modelService.model.processData.find(obj => obj.id === item.id).immediate = $event.checked;
        this.processData.find(obj => obj.id === item.id).immediate = $event.checked;
        break;
      }
      case 'desc': {
        this.modelService.model.processData.find(obj => obj.id === item.id).desc = $event.target.value;
        this.processData.find(obj => obj.id === item.id).desc = $event.target.value;
        break;
      }
      case 'placeholder': {
        this.modelService.model.processData.find(obj => obj.id === item.id).placeholder = $event.target.value;
        this.processData.find(obj => obj.id === item.id).placeholder = $event.target.value;
        break;
      }
      case 'valid': {
        this.modelService.model.processData.find(obj => obj.id === item.id).valid = $event.target.value;
        this.processData.find(obj => obj.id === item.id).valid = $event.target.value;
        break;
      }
    }
  }

  sortData(sort: Sort) {
    const firstCut = this.pageIndex * this.pageSize;
    const secondCut = firstCut + this.pageSize;
    if (!sort.active || sort.direction === '') {
      this.processData = [...this.modelService.model.processData];
      this.dataSource = this.processData.slice(firstCut, secondCut);
      return;
    }

    this.processData.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'id':
          return this.compare(a.id, b.id, isAsc);
      }
    });
    this.dataSource = this.processData.slice(firstCut, secondCut);
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.itemData.values, event.previousIndex, event.currentIndex);
  }

  AddOption() {
    this.itemData.values.push('value');
  }

  DeleteOption(index) {
    this.itemData.values.splice(index, 1);
  }

  private createOptionId() {
    this.counter++;
    if (this.itemData.values.find(item => item.key === 'key_' + this.counter)) {
      return this.createId();
    } else {
      return 'key_' + String(this.counter);
    }
  }

  showIcons(event) {
    event.target.querySelectorAll('.data-edit-list-icon').forEach(node => {
      node.classList.remove('data-edit-list-icon-hidden');
    });
  }

  hideIcons(event) {
    event.target.querySelectorAll('.data-edit-list-icon').forEach(node => {
      node.classList.add('data-edit-list-icon-hidden');
    });
  }

  openDialog(event, item): void {
    event.stopPropagation();
    const dialogRef = this.deleteDialog.open(DialogDeleteComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.removeDataVariable(item);
      }
    });
  }
}
