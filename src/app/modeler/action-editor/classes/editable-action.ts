export enum ActionType {
  TRANSITION = 'TRANSITION',
  DATA = 'DATA',
  DATAREF = 'DATAREF'
}

export enum ChangeType {
  MOVED,
  REMOVED,
  CREATED,
  EDITED
}

export class EditableAction {

  public changeType: ChangeType;
  public originalEvent: string;
  public originalPhase: string;

  constructor(public id: string, public type: ActionType, public wasCreated: boolean, public definition: string = '', public event?: string, public phase: string = 'pre', public parentDataRefId?: string) {
    this.changeType = undefined;
    if (!wasCreated) {
      this.originalEvent = event;
      this.originalPhase = phase;
    }
    if (this.type === ActionType.TRANSITION) {
      this.event = this.event ? this.event : 'finish';
    } else {
      this.event = this.event ? this.event : 'set';
    }
  }

  commitChanges(): void {
    this.changeType = undefined;
    this.originalEvent = this.event;
    this.originalPhase = this.phase;
  }
}
