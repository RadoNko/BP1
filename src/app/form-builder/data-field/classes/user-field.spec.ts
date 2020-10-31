import {UserField, UserFieldTypes} from './user-field';

describe('UserField', () => {
  it('should create an instance', () => {
    expect(new UserField('', '', true, ['editable'], '', '', 'outline', UserFieldTypes.SIMPLE)).toBeTruthy();
  });
});
