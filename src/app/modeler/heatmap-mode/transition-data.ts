export class TransitionData {
    private _task : String;
    private _state : String;
    private _timestamp : String;

    constructor(task: String, state: String, timestamp: String) {
        this._task = task;
        this._state = state;
        this._timestamp = timestamp;
    }

    get task(): String {
        return this._task;
    }

    set task(value: String) {
        this._task = value;
    }

    get state(): String {
        return this._state;
    }

    set state(value: String) {
        this._state = value;
    }

    get timestamp(): String {
        return this._timestamp;
    }

    set timestamp(value: String) {
        this._timestamp = value;
    }
    toString() : String{
        return "TASK: {"+this.task+"} STATE: {"+this.state+ "} TIMESTAMP: {"+this.timestamp+"}"
    }
}
