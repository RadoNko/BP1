export enum EventType {
  PLACED,
  REMOVED
}

export class GridsterExistingFieldEvent {
  constructor(public type: EventType, public fieldId: string) {
  }
}
