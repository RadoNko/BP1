import {ActionType, EditableAction} from './editable-action';
import {ActionEditorService} from '../action-editor.service';
import {BehaviorSubject} from 'rxjs';

export interface TreeNode {
  title?: string;
  id?: string;
  children?: Array<TreeNode>;
  actions?: Array<EditableAction>;
  canAdd?: boolean;
  type?: ActionType;
  transitionEvent?: string;
  parent?: TreeNode;
  actionCount: BehaviorSubject<number>;
}

export class LeafNode implements TreeNode {

  public parent = undefined;

  public actionCount: BehaviorSubject<number>;

  constructor(private actionEditorService: ActionEditorService, public actions: Array<EditableAction> = []) {
    this.actionCount = new BehaviorSubject<number>(actions.length);
  }

  public addAction(type: ActionType, trigger: string, transitionEvent?: string): EditableAction {
    let action;
    switch (type) {
      case ActionType.TRANSITION:
        action = new EditableAction(this.actionEditorService.nextId(), type, true, '', transitionEvent, trigger);
        break;
      case ActionType.DATA:
        action = new EditableAction(this.actionEditorService.nextId(), type, true, '', trigger);
        break;
      case ActionType.DATAREF:
        action =  new EditableAction(this.actionEditorService.nextId(), type, true, '', trigger, undefined, this.parent.parent.id);
        break;
    }
    this.actions.push(action);
    this.incrementCount();
    return action;
  }

  public pushAction(action: EditableAction): void {
    this.actions.push(action);
    this.incrementCount();
  }

  public removeAction(index: number): EditableAction {
    this.decrementCount();
    return this.actions.splice(index, 1)[0];
  }

  public hasDisplayableActions(): boolean {
    return this.actionCount.getValue() > 0;
  }

  private incrementCount(): void {
    this.actionCount.next(this.actionCount.getValue() + 1);
  }

  private decrementCount(): void {
    this.actionCount.next(this.actionCount.getValue() - 1);
  }
}
