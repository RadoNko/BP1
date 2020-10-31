import {FileField, FileFieldTypes} from './file-field';

describe('FileField', () => {
  it('should create an instance', () => {
    expect(new FileField('', '', true, ['editable'], '', FileFieldTypes.SIMPLE)).toBeTruthy();
  });
});
