import { IntlNumberPipe } from './intl-number.pipe';

describe('IntlNumberPipe', () => {
  let pipe: IntlNumberPipe;

  beforeEach(() => {
    pipe = new IntlNumberPipe('en-US', null);
  });

  it('create instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('format number', () => {
    const number = 123456789;
    const result = pipe.transform(number);
    expect(result).toEqual('123,456,789');
  });

  it('format null', () => {
    const result = pipe.transform(null);
    expect(result).toBeNull();
  });

  it('should use preset by string', () => {
    pipe = new IntlNumberPipe('en-US', {presets: {custom: { style: 'currency', currency: 'USD' }}});
    const number = 123456789;
    const result = pipe.transform(number, 'custom');
    expect(result).toEqual('$123,456,789.00');
  });

  it('should use preset by options', () => {
    pipe = new IntlNumberPipe('en-US', {presets: {custom: { style: 'currency', currency: 'USD' }}});
    const number = 123456789;
    const result = pipe.transform(number, { preset: 'custom' });
    expect(result).toEqual('$123,456,789.00');
  });

  it('should use overrides', () => {
    pipe = new IntlNumberPipe('en-US', {presets: {custom: { style: 'currency', currency: 'USD' }}});
    const number = 123456789;
    const result = pipe.transform(number, { preset: 'custom', currency: 'EUR' });
    expect(result).toEqual('€123,456,789.00');
  });

  // --- presets

  testPreset('short', '123456789.12');
  testPreset('long', '123,456,789.12345679');
  testPreset('currency', '$123,456,789.12');
  testPreset('percent', '12,345,678,912%');

  function testPreset(preset: string, expected: string) {
    it(`should use ${preset} preset`, () => {
      const number = 123456789.123456789;
      const result = pipe.transform(number, { preset });
      expect(result).toEqual(expected);
    });
  }
});
