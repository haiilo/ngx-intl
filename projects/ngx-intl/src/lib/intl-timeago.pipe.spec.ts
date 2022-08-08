import { IntlDatePipe } from './intl-date.pipe';
import { IntlTimeagoPipe } from './intl-timeago.pipe';

describe('IntlTimeagoPipe', () => {
  let pipe: IntlTimeagoPipe;

  beforeEach(() => {
    const datePipe = new IntlDatePipe('en-US', null, null);
    pipe = new IntlTimeagoPipe('en-US', null, datePipe);
  });

  it('should create instance', () => {
    expect(pipe).toBeTruthy();
  });

  testFormat(1, '1 second ago');
  testFormat(1 * 60, '1 minute ago');
  testFormat(1 * 60 * 60, '1 hour ago');
  testFormat(1 * 60 * 60 * 24, '1 day ago');
  testFormat(1 * 60 * 60 * 24 * 7, '1 week ago');
  testFormat(1 * 60 * 60 * 24 * 7 * 4, '4 weeks ago');
  testFormat(1 * 60 * 60 * 24 * 365 / 12, '1 month ago');
  testFormat(1 * 60 * 60 * 24 * 365 / 4, '1 quarter ago');
  testFormat(1 * 60 * 60 * 24 * 365, '1 year ago');
  function testFormat(offsetSeconds: number, expected: string) {
    it(`should format date as ${expected}`, () => {
      const now = new Date(Date.UTC(2020, 11, 21));
      const then = new Date(now.getTime() - offsetSeconds * 1000);
      expect(pipe.transform(then, { now })).toEqual(expected);
    });
    it(`should format number as ${expected}`, () => {
      const now = new Date(Date.UTC(2020, 11, 21)).getTime();
      const then = now - offsetSeconds * 1000;
      expect(pipe.transform(then, { now })).toEqual(expected);
    });
  }

  it('should format null', () => {
    const result = pipe.transform(null);
    expect(result).toBeNull();
  });

  it('should format undefined', () => {
    const result = pipe.transform(undefined);
    expect(result).toMatch('in 0 seconds');
  });

  it('should use preset by string', () => {
    const datePipe = new IntlDatePipe('en-US', null, null);
    pipe = new IntlTimeagoPipe('en-US', {presets: {custom: {style: 'short'}}}, datePipe);
    const then = new Date(new Date().getTime() - 1 * 60 * 60 * 24 * 365 / 12 * 2 * 1000);
    const result = pipe.transform(then, 'custom');
    expect(result).toEqual('2 mo. ago');
  });

  it('should use preset by options', () => {
    const datePipe = new IntlDatePipe('en-US', null, null);
    pipe = new IntlTimeagoPipe('en-US', {presets: {custom: {style: 'short'}}}, datePipe);
    const now = new Date(Date.UTC(2020, 11, 21));
    const then = new Date(Date.UTC(2020, 9, 21));
    const result = pipe.transform(then, { now, preset: 'custom' });
    expect(result).toEqual('2 mo. ago');
  });

  it('should use overrides', () => {
    const datePipe = new IntlDatePipe('en-US', null, null);
    pipe = new IntlTimeagoPipe('en-US', {presets: {custom: {style: 'short'}}}, datePipe);
    const now = new Date(Date.UTC(2020, 11, 21));
    const then = new Date(Date.UTC(2020, 9, 21));
    const result = pipe.transform(then, { now, preset: 'custom', style: 'long' });
    expect(result).toEqual('2 months ago');
  });

  it('should use default', () => {
    const datePipe = new IntlDatePipe('en-US', null, null);
    pipe = new IntlTimeagoPipe('en-US', {presets: {custom: {style: 'short'}}, defaultPreset: 'custom'}, datePipe);
    const now = new Date(Date.UTC(2020, 11, 21));
    const then = new Date(Date.UTC(2020, 9, 21));
    const result = pipe.transform(then, { now });
    expect(result).toEqual('2 mo. ago');
  });

  it('should format with maxRelative', () => {
    const now = new Date(Date.UTC(2020, 11, 21));
    const then = new Date(Date.UTC(2020, 11, 20));
    expect(pipe.transform(then, { now, maxRelative: 1 * 60 * 60 * 24 })).toEqual('12/20/2020');
  });

  it('should format with maxRelative with options', () => {
    const now = new Date(Date.UTC(2020, 11, 21));
    const then = new Date(Date.UTC(2020, 11, 20));
    expect(pipe.transform(then, { now, maxRelative: 1 * 60 * 60 * 24, dateOptions: 'shortDate' })).toEqual('12/20/20');
  });

  it('should format with restricted units', () => {
    const now = new Date(Date.UTC(2020, 11, 21));
    const then = new Date(Date.UTC(2020, 11, 20));
    expect(pipe.transform(then, { now, units: ['second', 'minute', 'hour'] })).toEqual('24 hours ago');
  });

  it('should format with restricted units (only larger)', () => {
    const now = new Date(Date.UTC(2020, 11, 21));
    const then = new Date(Date.UTC(2020, 11, 20));
    expect(pipe.transform(then, { now, units: ['quarter', 'year'] })).toEqual('0 quarters ago');
  });

  it('should format with restricted units (empty)', () => {
    const now = new Date(Date.UTC(2020, 11, 21));
    const then = new Date(Date.UTC(2020, 11, 20));
    expect(pipe.transform(then, { now, units: [] })).toEqual('86,400 seconds ago');
  });
});
