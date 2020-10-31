import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Role} from '../../../classes/role';
import {RoleRef} from '../../../classes/role-ref';
import {MatTableDataSource} from '@angular/material/table';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';

export interface IRolesAndRefs {
  roles: Role[];
  rolesRefs: RoleRef[];
}

@Component({
  selector: 'nab-dialog.manage-roles',
  templateUrl: './dialog.manage-roles.component.html',
  styleUrls: ['./dialog.manage-roles.component.scss']
})
export class DialogManageRolesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'perform', 'delegate', 'view'];
  dataSource: MatTableDataSource<RoleRef>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<DialogManageRolesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IRolesAndRefs) {
    const array = [...this.data.rolesRefs];
    this.data.roles.forEach( item => {
        if (this.data.rolesRefs.find(itm => itm.id === item.id) === undefined) {
            array.push(new RoleRef(item.id));
        }
    });
    this.dataSource = new MatTableDataSource<RoleRef>(array);
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'perform': return item.logic.perform.toString();
        case 'delegate': return item.logic.delegate.toString();
        case 'view': return item.logic.view.toString();
        default: return item[property];
      }
    };
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  setValue($event, id: string, change) {
    switch (change) {
      case 'perform': {
        const roleRef = this.data.rolesRefs.find(item => item.id === id);
        if (roleRef === undefined) {
          this.data.rolesRefs.push(new RoleRef(id));
          this.data.rolesRefs.find(item => item.id === id).logic.perform = $event.checked;
          this.dataSource.data.find(item => item.id === id).logic.perform = $event.checked;
        } else {
          this.data.rolesRefs.find(item => item.id === id).logic.perform = $event.checked;
          this.dataSource.data.find(item => item.id === id).logic.perform = $event.checked;
        }
        break;
      }
      case 'delegate': {
        const roleRef = this.data.rolesRefs.find(item => item.id === id);
        if (roleRef === undefined) {
          this.data.rolesRefs.push(new RoleRef(id));
          this.data.rolesRefs.find(item => item.id === id).logic.delegate = $event.checked;
          this.dataSource.data.find(item => item.id === id).logic.delegate = $event.checked;
        } else {
          this.data.rolesRefs.find(item => item.id === id).logic.delegate = $event.checked;
          this.dataSource.data.find(item => item.id === id).logic.delegate = $event.checked;
        }
        break;
      }
      case 'view': {
        const roleRef = this.data.rolesRefs.find(item => item.id === id);
        if (roleRef === undefined) {
          this.data.rolesRefs.push(new RoleRef(id));
          this.data.rolesRefs.find(item => item.id === id).logic.view = $event.checked;
          this.dataSource.data.find(item => item.id === id).logic.view = $event.checked;
        } else {
          this.data.rolesRefs.find(item => item.id === id).logic.view = $event.checked;
          this.dataSource.data.find(item => item.id === id).logic.view = $event.checked;
        }
        break;
      }
    }
  }
}
