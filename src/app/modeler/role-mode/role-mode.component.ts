import {AfterViewInit, Component} from '@angular/core';
import {Role} from '../classes/role';
import {ModelService} from '../model.service';
import {RoleModeService} from './role-mode.service';
import {Model} from '../classes/model';
import {DialogDeleteComponent} from '../../dialog-delete/dialog-delete.component';
import {MatDialog} from '@angular/material/dialog';
import {Sort} from '@angular/material/sort';

@Component({
  selector: 'nab-role-mode',
  templateUrl: './role-mode.component.html',
  styleUrls: ['./role-mode.component.scss']
})
export class RoleModeComponent implements AfterViewInit {
  dataSource: Role[];
  length: number;
  pageSize: number;
  pageIndex: number;
  pageSizeOptions: number[] = [5, 10, 20];
  show: boolean;

  counter: number;
  roles: Role[];

  constructor(private modelService: ModelService, private roleService: RoleModeService, private deleteDialog: MatDialog) {
    setTimeout(() => {
      if (this.modelService.model === undefined) {
        this.modelService.model = new Model();
      }
      this.roleService.event.next();
    });
    this.roleService.event.subscribe(() => {
      this.pageSize = 5;
      this.pageIndex = 0;
      this.roles = [...this.modelService.model.roles];
      this.length = this.roles.length;
      this.dataSource = [...this.roles.slice(0, this.pageSize)];
      this.counter = 0;
      if (this.show === undefined) {
        this.show = false;
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.show = true;
    });
  }

  onPageChanged(e) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    const firstCut = e.pageIndex * e.pageSize;
    const secondCut = firstCut + e.pageSize;
    this.dataSource = this.roles.slice(firstCut, secondCut);
  }

  onCRUDChange() {
    const firstCut = this.pageIndex * this.pageSize;
    const secondCut = firstCut + this.pageSize;
    this.dataSource = this.roles.slice(firstCut, secondCut);
  }

  addRole() {
    const role = new Role(this.createId());
    this.modelService.model.roles.push(role);
    this.roles.push(role);
    this.dataSource.push(role);
    this.length = this.modelService.model.roles.length;
    this.pageIndex = Math.ceil(this.modelService.model.roles.length / this.pageSize) - 1;
    this.onCRUDChange();
  }

  private createId() {
    this.counter++;
    if (this.modelService.model.roles.find(item => item.id === 'newRole_' + this.counter)) {
      return this.createId();
    } else {
      return 'newRole_' + String(this.counter);
    }
  }

  setValue($event, item: Role, variable: string) {
    switch (variable) {
      case 'id': {
        this.modelService.model.roles.find(obj => obj.id === item.id).id = $event.target.value;
        this.roles.find(obj => obj.id === item.id).id = $event.target.value;
        break;
      }
      case 'title': {
        this.modelService.model.roles.find(obj => obj.id === item.id).title = $event.target.value;
        this.roles.find(obj => obj.id === item.id).title = $event.target.value;
        break;
      }
    }
  }

  removeRole(item) {
    this.modelService.model.roles.splice(this.modelService.model.roles.indexOf(item), 1);
    this.roles.splice(this.roles.indexOf(item), 1);
    this.dataSource.splice(this.dataSource.indexOf(item), 1);
    this.length = this.roles.length;
    this.onCRUDChange();
  }

  sortData(sort: Sort) {
    const firstCut = this.pageIndex * this.pageSize;
    const secondCut = firstCut + this.pageSize;
    if (!sort.active || sort.direction === '') {
      this.roles = [...this.modelService.model.roles];
      this.dataSource = this.roles.slice(firstCut, secondCut);
      return;
    }

    this.roles.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'title': return this.compare(a.title, b.title, isAsc);
        case 'id': return this.compare(a.id, b.id, isAsc);
      }
    });
    this.dataSource = this.roles.slice(firstCut, secondCut);
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  openDialog(item): void {
    const dialogRef = this.deleteDialog.open(DialogDeleteComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.removeRole(item);
      }
    });
  }
}
