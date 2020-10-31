import {NumberField, NumberFieldTypes} from './number-field';

describe('NumberField', () => {
  it('should create an instance', () => {
    expect(new NumberField('', '', 0, true, ['editable'], '', '', 'outline', NumberFieldTypes.SIMPLE)).toBeTruthy();
  });
});
