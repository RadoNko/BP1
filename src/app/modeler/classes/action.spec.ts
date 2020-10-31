import { Action } from './action';

describe('Action', () => {
  it('should create an instance', () => {
    expect(new Action(null, null, null)).toBeTruthy();
  });
});
