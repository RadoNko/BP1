import {TaskRefField, TaskRefFieldTypes} from './task-ref-field';

describe('TaskRefField', () => {
  it('should create an instance', () => {
    expect(new TaskRefField('', '', '', true, ['editable'], '', '', 'outline', TaskRefFieldTypes.SIMPLE)).toBeTruthy();
  });
});
