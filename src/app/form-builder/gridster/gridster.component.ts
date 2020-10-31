import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {GridsterConfig} from 'angular-gridster2';
import {GridsterService} from './gridster.service';
import {FieldListService} from '../field-list/field-list.service';
import {EventType, GridsterExistingFieldEvent} from '../field-list/classes/gridster-existing-field-event';
import {GridsterDataField} from './classes/gridster-data-field';

@Component({
  selector: 'nab-gridster-component',
  styleUrls: ['gridster.component.scss'],
  templateUrl: './gridster.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})

export class GridsterComponent implements OnInit {
  options: GridsterConfig;
  placedDataFields: Array<GridsterDataField>;

  constructor(private gridsterService: GridsterService, private fieldListService: FieldListService) {
  }

  ngOnInit() {
    this.options = this.gridsterService.options;
    this.placedDataFields = this.gridsterService.placedDataFields;
  }

  removeItem($event) {
    $event.preventDefault();
    $event.stopPropagation();
    if (this.gridsterService.itemIndex > -1 && this.gridsterService.itemIndex < this.gridsterService.placedDataFields.length) {
      this.fieldListService.existingFieldEvents.next(new GridsterExistingFieldEvent(EventType.REMOVED, this.placedDataFields[this.gridsterService.itemIndex].datafield.id));
      this.placedDataFields.splice(this.gridsterService.itemIndex, 1);
      this.deselect();
    }
  }

  deselect() {
    document.getElementById('ctxMenu').style.visibility = 'hidden';
    this.gridsterService.itemIndex = -1;
  }

  editDatafield($event: MouseEvent, item: GridsterDataField) {
    document.getElementById('ctxMenu').style.visibility = 'hidden';
    $event.preventDefault();
    $event.stopPropagation();
    this.gridsterService.editDatafield(item);
  }

  isActive(item): boolean {
    return this.placedDataFields.indexOf(item) === this.gridsterService.itemIndex;
  }

  openMenu($event: MouseEvent, item: GridsterDataField) {
    const i = document.getElementById('ctxMenu').style;
    i.top = $event.clientY + 'px';
    i.left = $event.clientX + 'px';
    i.visibility = 'visible';
    i.opacity = '1';
    $event.preventDefault();
    $event.stopPropagation();
    this.gridsterService.editDatafield(item);
  }
}


