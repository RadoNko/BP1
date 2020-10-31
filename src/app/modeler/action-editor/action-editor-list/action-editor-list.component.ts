import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ChangeType, EditableAction} from '../classes/editable-action';
import {LeafNode} from '../classes/leaf-node';
import {ResizeEvent} from 'angular-resizable-element';
import {DialogDeleteComponent} from '../../../dialog-delete/dialog-delete.component';
import {MatDialog} from '@angular/material/dialog';

export interface ActionChangedEvent {
  triggerPath?: Array<string>;
  action: EditableAction;
}

@Component({
  selector: 'nab-action-editor-list',
  templateUrl: './action-editor-list.component.html',
  styleUrls: ['./action-editor-list.component.scss']
})
export class ActionEditorListComponent {

  @Input() public leafNode: LeafNode;
  @Output() public actionChanged: EventEmitter<ActionChangedEvent>;
  public TRANSITION_EVENT_TYPES = ['assign', 'finish', 'cancel', 'delegate'];
  public DATA_EVENT_TYPES = ['set', 'get'];
  public PHASE_TYPES = ['pre', 'post'];

  constructor(private deleteDialog: MatDialog) {
    this.actionChanged = new EventEmitter<ActionChangedEvent>();
  }

  deleteAction(index: number): void {
    const action = this.leafNode.removeAction(index);
    action.changeType = ChangeType.REMOVED;
    this.actionChanged.emit({
      action
    });
  }

  actionTransitonEventsChanged(index: number): void {
    const action = this.leafNode.removeAction(index);
    action.changeType = ChangeType.MOVED;
    this.actionChanged.emit({
      triggerPath: [action.event, action.phase],
      action
    });
  }

  actionDataEventsChanged(index: number): void {
    const action = this.leafNode.removeAction(index);
    action.changeType = ChangeType.MOVED;
    this.actionChanged.emit({
      triggerPath: [action.event],
      action
    });
  }

  setHeightOnClose(index: number, action: any): void {
    const element = document.getElementById(action.event + '_' + action.phase + '_' + index) as HTMLElement;
    element.style.height = 'auto';
  }

  onResizeEvent(event: ResizeEvent, name: string): void {
    const newHeight = event.rectangle.height < 370 ? 370 : event.rectangle.height;
    const element = document.getElementById(name);
    const headerSize = (element.childNodes[0] as HTMLElement).offsetHeight;
    const bottomSize = (element.childNodes[1].childNodes[1] as HTMLElement).offsetHeight;
    const div = document.getElementById(name + '_div');
    const editor = document.getElementById(name + '_editor');
    element.style.height = newHeight + 'px';
    const innerSize = newHeight - headerSize - bottomSize - 16;
    div.style.height = innerSize + 'px';
    editor.style.height = innerSize + 'px';
  }

  openDialog(index: number): void {
    const dialogRef = this.deleteDialog.open(DialogDeleteComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteAction(index);
      }
    });
  }
}
