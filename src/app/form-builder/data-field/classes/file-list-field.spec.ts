import {FileListField, FileListFieldTypes} from './file-list-field';

describe('FileListField', () => {
  it('should create an instance', () => {
    expect(new FileListField('', '', true, ['editable'], '', FileListFieldTypes.SIMPLE)).toBeTruthy();
  });
});
