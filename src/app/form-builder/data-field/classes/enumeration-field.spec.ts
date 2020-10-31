import {EnumerationField, EnumerationFieldTypes} from './enumeration-field';

describe('EnumerationField', () => {
  it('should create an instance', () => {
    expect(new EnumerationField('', '', '', [], true, ['editable'], '', '', 'outline', EnumerationFieldTypes.SELECT)).toBeTruthy();
  });
});
