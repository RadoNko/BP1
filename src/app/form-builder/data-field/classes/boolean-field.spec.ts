import {BooleanField, BooleanFieldTypes} from './boolean-field';

describe('BooleanField', () => {
  it('should create an instance', () => {
    expect(new BooleanField('', '', false, true, ['editable'], BooleanFieldTypes.SLIDE)).toBeTruthy();
  });
});
