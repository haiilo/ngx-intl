import { IntlListPipe } from './intl-list.pipe';

describe('IntlListPipe', () => {
  let pipe: IntlListPipe;

  beforeEach(() => {
    pipe = new IntlListPipe('en-US', null);
  });

  it('create instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('format list', () => {
    const list = ['a', 'b', 'c'];
    const result = pipe.transform(list);
    expect(result).toEqual('a, b, and c');
  });

  it('format null', () => {
    const result = pipe.transform(null);
    expect(result).toBeNull();
  });

  it('should use preset by string', () => {
    pipe = new IntlListPipe('en-US', {presets: {custom: { type: 'disjunction' }}});
    const list = ['a', 'b', 'c'];
    const result = pipe.transform(list, 'custom');
    expect(result).toEqual('a, b, or c');
  });

  it('should use preset by options', () => {
    pipe = new IntlListPipe('en-US', {presets: {custom: { type: 'disjunction' }}});
    const list = ['a', 'b', 'c'];
    const result = pipe.transform(list, { preset: 'custom' });
    expect(result).toEqual('a, b, or c');
  });

  it('should use overrides', () => {
    pipe = new IntlListPipe('en-US', {presets: {custom: { type: 'disjunction' }}});
    const list = ['a', 'b', 'c'];
    const result = pipe.transform(list, { preset: 'custom', type: 'conjunction' });
    expect(result).toEqual('a, b, and c');
  });

  // --- presets

  testPreset('and', 'a, b, and c');
  testPreset('or', 'a, b, or c');

  function testPreset(preset: string, expected: string) {
    it(`should use ${preset} preset`, () => {
      const list = ['a', 'b', 'c'];
      const result = pipe.transform(list, { preset });
      expect(result).toEqual(expected);
    });
  }
});
