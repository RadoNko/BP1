import {Component, OnInit} from '@angular/core';
import {ModelService} from '../../../model.service';
import {DataVariable} from '../../../classes/data-variable';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'nab-dialog-arc-attach',
  templateUrl: './dialog-arc-attach.component.html',
  styleUrls: ['./dialog-arc-attach.component.scss']
})
export class DialogArcAttachComponent implements OnInit {
  dataSource: DataVariable[];
  length: number;
  pageSize: number;
  pageIndex: number;
  pageSizeOptions: number[] = [10, 20, 50, 100];
  selectedItem: DataVariable;

  constructor(private modelService: ModelService, public dialogRef: MatDialogRef<DialogArcAttachComponent>) {
    this.pageSize = 20;
    this.pageIndex = 0;
    this.length = this.modelService.model.processData.length;
    this.dataSource = [...this.modelService.model.processData.slice(0, this.pageSize)];
    if (this.modelService.model.arc_for_data.dataref) {
      this.selectedItem = this.modelService.model.arc_for_data.dataref;
    }
    this.dialogRef.beforeClosed().subscribe(() => {
      this.dialogRef.close(this.selectedItem);
    });
  }

  ngOnInit(): void {
  }

  onPageChanged(e) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    const firstCut = e.pageIndex * e.pageSize;
    const secondCut = firstCut + e.pageSize;
    this.dataSource = this.modelService.model.processData.slice(firstCut, secondCut);
  }

  setArcVariability(item: DataVariable) {
    const vaha = parseInt(item.value, 10);

    if (isNaN(vaha)) {
      alert('Not a number. Cannot change the value of arc weight.');
      return;
    }
    if (vaha < 0) {
      alert('A negative number. Cannot change the value of arc weight.');
      return;
    }
    this.selectedItem = item;
  }

  removeArcVariability() {
    this.selectedItem = undefined;
  }

  isSelected(item: DataVariable): boolean {
    if (this.selectedItem !== undefined) {
      return item.id === this.selectedItem.id;
    } else {
      return false;
    }
  }
}
