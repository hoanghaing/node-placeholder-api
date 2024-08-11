import { addNumbers } from '../../src/utils/exampleUtility';

describe('addNumbers', () => {
  it('should add two numbers correctly', () => {
    expect(addNumbers(1, 2)).toBe(3);
  });
});
