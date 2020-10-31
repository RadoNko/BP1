import {MultichoiceField, MultichoiceFieldTypes} from './multichoice-field';

describe('MultichoiceField', () => {
  it('should create an instance', () => {
    expect(new MultichoiceField('', '', [], [], true, ['editable'], '', '', 'outline', MultichoiceFieldTypes.SELECT)).toBeTruthy();
  });
});
