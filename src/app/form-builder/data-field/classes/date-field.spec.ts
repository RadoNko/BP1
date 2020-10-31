import {DateField, DateFieldTypes} from './date-field';

describe('DateField', () => {
  it('should create an instance', () => {
    expect(new DateField('', '', new Date(), true, ['editable'], '', '', 'outline', DateFieldTypes.SIMPLE)).toBeTruthy();
  });
});
