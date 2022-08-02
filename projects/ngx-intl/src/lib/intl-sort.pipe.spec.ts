import { IntlSortPipe } from './intl-sort.pipe';

describe('IntlSortPipe', () => {
  let pipe: IntlSortPipe;

  beforeEach(() => {
    pipe = new IntlSortPipe('en-US', null);
  });

  it('should create instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should sort list', () => {
    const list = ['Z', 'a', 'z', 'e'];
    const result = pipe.transform(list);
    expect(result).toEqual(['a', 'e', 'z', 'Z']);
  });

  it('should sort null', () => {
    const result = pipe.transform(null);
    expect(result).toBeNull();
  });

  it('should should use preset by string', () => {
    pipe = new IntlSortPipe('en-US', {presets: {custom: { caseFirst: 'upper' }}});
    const list = ['Z', 'a', 'z', 'e'];
    const result = pipe.transform(list, 'custom');
    expect(result).toEqual(['a', 'e', 'Z', 'z']);
  });

  it('should should use preset by options', () => {
    pipe = new IntlSortPipe('en-US', {presets: {custom: { caseFirst: 'upper' }}});
    const list = ['Z', 'a', 'z', 'e'];
    const result = pipe.transform(list, { preset: 'custom' });
    expect(result).toEqual(['a', 'e', 'Z', 'z']);
  });

  it('should should use overrides', () => {
    pipe = new IntlSortPipe('en-US', {presets: {custom: { caseFirst: 'upper' }}});
    const list = ['Z', 'a', 'z', 'e'];
    const result = pipe.transform(list, { preset: 'custom', caseFirst: 'lower' });
    expect(result).toEqual(['a', 'e', 'z', 'Z']);
  });

  // --- presets

  testPreset('lowerFirst', ['a', 'e', 'z', 'Z']);
  testPreset('upperFirst', ['a', 'e', 'Z', 'z']);

  function testPreset(preset: string, expected: string[]) {
    it(`should use ${preset} preset`, () => {
      const list = ['Z', 'a', 'z', 'e'];
      const result = pipe.transform(list, { preset });
      expect(result).toEqual(expected);
    });
  }
});
