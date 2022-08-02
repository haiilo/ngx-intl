import { IntlPluralPipe } from './intl-plural.pipe';

describe('IntlPluralPipe', () => {
  let pipe: IntlPluralPipe;

  beforeEach(() => {
    pipe = new IntlPluralPipe('en-US', null);
  });

  it('create instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('format number', () => {
    const number = 3;
    const result = pipe.transform(number);
    expect(result).toEqual('other');
  });

  it('format null', () => {
    const result = pipe.transform(null);
    expect(result).toBeNull();
  });

  it('should use preset by string', () => {
    pipe = new IntlPluralPipe('en-US', {presets: {custom: { type: 'ordinal' }}});
    const number = 3;
    const result = pipe.transform(number, 'custom');
    expect(result).toEqual('few');
  });

  it('should use preset by options', () => {
    pipe = new IntlPluralPipe('en-US', {presets: {custom: { type: 'ordinal' }}});
    const number = 3;
    const result = pipe.transform(number, { preset: 'custom' });
    expect(result).toEqual('few');
  });

  it('should use overrides', () => {
    pipe = new IntlPluralPipe('en-US', {presets: {custom: { type: 'ordinal' }}});
    const number = 3;
    const result = pipe.transform(number, { preset: 'custom', type: 'cardinal' });
    expect(result).toEqual('other');
  });

  // --- presets

  testPreset('cardinal', 'other');
  testPreset('ordinal', 'few');

  function testPreset(preset: string, expected: string) {
    it(`should use ${preset} preset`, () => {
      const number = 3;
      const result = pipe.transform(number, { preset });
      expect(result).toEqual(expected);
    });
  }
});
