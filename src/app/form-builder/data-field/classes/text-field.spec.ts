import {TextField, TextFieldTypes} from './text-field';

describe('TextField', () => {
  it('should create an instance', () => {
    expect(new TextField('', '', '', true, ['editable'], '', '', 'outline', TextFieldTypes.SIMPLE)).toBeTruthy();
  });
});
