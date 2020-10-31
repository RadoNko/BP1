import {Injectable} from '@angular/core';
import {ActionType, ChangeType, EditableAction} from './classes/editable-action';
import {ActionGroup} from './classes/action-group';
import {DataRef} from '../classes/data-ref';
import {Action} from '../classes/action';
import {Transition} from '../classes/transition';
import {Event} from '../classes/event';
import {DataVariable} from '../classes/data-variable';

@Injectable({
  providedIn: 'root'
})
export class ActionEditorService {

  public editedActions: Array<ActionGroup>;

  private _datarefMap: Map<string, DataRef>;
  private _lastUsedId: number;
  private _currentlyEdited: Transition | DataVariable;

  constructor() {
    this.editedActions = [];
    this._lastUsedId = 0;
    this._datarefMap = new Map<string, DataRef>();
  }

  public nextId(): string {
    this._lastUsedId++;
    return String(this._lastUsedId);
  }

  public populateEditedActionsFromTransition(transition: Transition): void {
    this.editedActions.splice(0, this.editedActions.length);
    this._datarefMap.clear();
    this._currentlyEdited = transition;

    // transition actions
    const transitionActions = [];
    transition.events.forEach(event => {
      event.preactions.forEach(preaction => {
        if (preaction.id === undefined || preaction.id === null) {
          preaction.id = this.nextId();
        } else {
          this.updateLastId(preaction.id);
        }
        transitionActions.push(new EditableAction(preaction.id, ActionType.TRANSITION, false, preaction.definition, event.type, 'pre'));
      });
      event.postactions.forEach(postaction => {
        if (postaction.id === undefined || postaction.id === null) {
          postaction.id = this.nextId();
        } else {
          this.updateLastId(postaction.id);
        }
        transitionActions.push(new EditableAction(postaction.id, ActionType.TRANSITION, false, postaction.definition, event.type, 'post'));
      });
    });
    this.editedActions.push(new ActionGroup(ActionType.TRANSITION, 'Transition', transitionActions));

    // dataref actions
    let combinedDataRefs = [...transition.dataRefs];
    transition.dataGroups.forEach(dataGroup => {
      combinedDataRefs = combinedDataRefs.concat(dataGroup.dataRefs);
    });

    combinedDataRefs.forEach(dataref => {
      const datarefActions = [];
      this._datarefMap.set(dataref.id, dataref);

      dataref.logic.actions.forEach(action => {
        if (action.id === undefined || action.id === null) {
          action.id = this.nextId();
        } else {
          this.updateLastId(action.id);
        }
        datarefActions.push(new EditableAction(action.id, ActionType.DATAREF, false, action.definition, action.trigger, undefined, dataref.id));
      });
      this.editedActions.push(new ActionGroup(ActionType.DATAREF, dataref.id, datarefActions));
    });
  }

  public populateEditedActionsFromDataVariable(dataVariable: DataVariable): void {
    this.editedActions.splice(0, this.editedActions.length);
    this._currentlyEdited = dataVariable;

    const group = new ActionGroup(ActionType.DATA, dataVariable.name);
    dataVariable.actions.forEach(action => {
      if (action.id === undefined || action.id === null) {
        action.id = this.nextId();
      } else {
        this.updateLastId(action.id);
      }
      group.editableActions.push(new EditableAction(action.id, ActionType.DATA, false, action.definition, action.trigger));
    });

    this.editedActions.push(group);
  }

  private updateLastId(id: string): void {
    const parsedId = parseInt(id, 10);
    this._lastUsedId = Math.max(this._lastUsedId, isNaN(parsedId) ? 0 : parsedId);
  }

  public saveActionChange(changedAction: EditableAction) {
    switch (changedAction.type) {
      case ActionType.DATA:
        this.saveDataAction(changedAction);
        break;
      case ActionType.DATAREF:
        this.saveDatarefAction(changedAction);
        break;
      case ActionType.TRANSITION:
        this.saveTransitionAction(changedAction);
        break;
    }
    changedAction.commitChanges();
  }

  private saveDataAction(changedAction: EditableAction): void {
    let action;
    switch (changedAction.changeType) {
      case ChangeType.MOVED:
      case ChangeType.EDITED:
        action = (this._currentlyEdited as DataVariable).actions.find(it => it.id === changedAction.id);
        action.definition = changedAction.definition;
        action.trigger = changedAction.event;
        return;
      case ChangeType.CREATED:
        action = new Action(changedAction.id, changedAction.event, changedAction.definition);
        (this._currentlyEdited as DataVariable).actions.push(action);
        return;
      case ChangeType.REMOVED:
        const index = (this._currentlyEdited as DataVariable).actions.findIndex(it => it.id === changedAction.id);
        (this._currentlyEdited as DataVariable).actions.splice(index, 1);
        return;
    }
  }

  private saveDatarefAction(changedAction: EditableAction): void {
    let action;
    let logic;
    switch (changedAction.changeType) {
      case ChangeType.MOVED:
      case ChangeType.EDITED:
        logic = this.getDatarefLogic(changedAction.parentDataRefId);
        action = logic.actions.find(it => it.id === changedAction.id);
        action.definition = changedAction.definition;
        action.trigger = changedAction.event;
        return;
      case ChangeType.CREATED:
        action = new Action(changedAction.id, undefined, changedAction.definition);
        logic = this.getDatarefLogic(changedAction.parentDataRefId);
        logic.actions.push(action);
        return;
      case ChangeType.REMOVED:
        logic = this.getDatarefLogic(changedAction.parentDataRefId);
        const index = logic.actions.findIndex(it => it.id === changedAction.id);
        logic.actions.splice(index, 1);
        return;
    }
  }

  private saveTransitionAction(changedAction: EditableAction): void {
    let action;
    let event;
    let actions;
    let index;
    switch (changedAction.changeType) {
      case ChangeType.EDITED:
        event = (this._currentlyEdited as Transition).events.find(it => it.type === changedAction.event);
        actions = this.getTransitionActions(event, changedAction.phase);
        action = actions.find(it => it.id === changedAction.id);
        action.definition = changedAction.definition;
        return;
      case ChangeType.MOVED:
        event = (this._currentlyEdited as Transition).events.find(it => it.type === changedAction.originalEvent);
        actions = this.getTransitionActions(event, changedAction.originalPhase);
        index = actions.findIndex(it => it.id === changedAction.id);
        action = actions.splice(index, 1)[0];

        event = (this._currentlyEdited as Transition).events.find(it => it.type === changedAction.event);
        if (event === undefined) {
          event = new Event();
          event.id = `${(this._currentlyEdited as Transition).id}_${changedAction.event}`;
          event.type = changedAction.event;
          (this._currentlyEdited as Transition).events.push(event);
        }
        actions = this.getTransitionActions(event, changedAction.phase);
        actions.push(action);
        return;
      case ChangeType.CREATED:
        event = (this._currentlyEdited as Transition).events.find(it => it.type === changedAction.event);
        if (event === undefined) {
          event = new Event();
          event.id = `${(this._currentlyEdited as Transition).id}_${changedAction.event}`;
          event.type = changedAction.event;
          (this._currentlyEdited as Transition).events.push(event);
        }
        actions = this.getTransitionActions(event, changedAction.phase);
        actions.push(new Action(changedAction.id, undefined, changedAction.definition));
        return;
      case ChangeType.REMOVED:
        event = (this._currentlyEdited as Transition).events.find(it => it.type === changedAction.event);
        actions = this.getTransitionActions(event, changedAction.phase);
        index = actions.findIndex(it => it.id === changedAction.id);
        actions.splice(index, 1);
    }
  }

  private getTransitionActions(event: Event, phase: string): Array<Action> {
    if (phase === 'pre') {
      return event.preactions;
    } else {
      return event.postactions;
    }
  }

  private getDatarefLogic(datarefId: string): DataRef['logic'] {
    let dataRef = (this._currentlyEdited as Transition).dataRefs.find(it => it.id === datarefId);
    if (dataRef === undefined) {
      for (const dataGroup of (this._currentlyEdited as Transition).dataGroups) {
        dataRef = dataGroup.dataRefs.find(it => it.id === datarefId);
        if (dataRef !== undefined) {
          break;
        }
      }
    }
    return dataRef.logic;
  }
}
