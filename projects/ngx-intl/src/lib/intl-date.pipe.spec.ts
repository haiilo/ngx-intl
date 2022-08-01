import { IntlDatePipe } from './intl-date.pipe';

describe('IntlDatePipe', () => {
  let pipe: IntlDatePipe;

  beforeEach(() => {
    pipe = new IntlDatePipe('en-US', null);
  });

  it('should create instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format date', () => {
    const date = new Date(Date.UTC(2020, 11, 20));
    const result = pipe.transform(date);
    expect(result).toEqual('12/20/2020');
  });

  it('should format number', () => {
    const time = new Date(Date.UTC(2020, 11, 20)).getTime();
    const result = pipe.transform(time);
    expect(result).toEqual('12/20/2020');
  });

  it('should format null', () => {
    const result = pipe.transform(null);
    expect(result).toBeNull();
  });

  it('should format undefined', () => {
    const result = pipe.transform(undefined);
    expect(result).toMatch(/^\d{1,2}\/\d{1,2}\/\d{4}$/);
  });

  it('should use preset by string', () => {
    pipe = new IntlDatePipe('en-US', {presets: {short: {dateStyle: 'short'}}});
    const date = new Date(Date.UTC(2020, 11, 20));
    const result = pipe.transform(date, 'short');
    expect(result).toEqual('12/20/20');
  });

  it('should use preset by options', () => {
    pipe = new IntlDatePipe('en-US', {presets: {custom: {dateStyle: 'short'}}});
    const date = new Date(Date.UTC(2020, 11, 20));
    const result = pipe.transform(date, { preset: 'custom' });
    expect(result).toEqual('12/20/20');
  });

  it('should use overrides', () => {
    pipe = new IntlDatePipe('en-US', {presets: {custom: {dateStyle: 'short'}}});
    const date = new Date(Date.UTC(2020, 11, 20));
    const result = pipe.transform(date, { preset: 'custom', dateStyle: 'long' });
    expect(result).toEqual('December 20, 2020');
  });

  // --- presets

  testPreset('short', '6/15/15, 9:03 AM');
  testPreset('medium', 'Jun 15, 2015, 9:03:01 AM');
  testPreset('long', 'June 15, 2015 at 9:03:01 AM GMT+1');
  testPreset('full', 'Monday, June 15, 2015 at 9:03:01 AM GMT+01:00');
  testPreset('shortDate', '6/15/15');
  testPreset('mediumDate', 'Jun 15, 2015');
  testPreset('longDate', 'June 15, 2015');
  testPreset('fullDate', 'Monday, June 15, 2015');
  testPreset('shortTime', '9:03 AM');
  testPreset('mediumTime', '9:03:01 AM');
  testPreset('longTime', '9:03:01 AM GMT+1');
  testPreset('fullTime', '9:03:01 AM GMT+01:00');

  function testPreset(preset: string, expected: string) {
    it(`should use ${preset} preset`, () => {
      const date = new Date(Date.UTC(2015, 5, 15, 8, 3, 1));
      const result = pipe.transform(date, { preset, timeZone: 'WET' });
      expect(result).toEqual(expected);
    });
  }
});
