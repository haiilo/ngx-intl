import { ChangeDetectorRef, NgZone } from '@angular/core';
import { IntlTimeagoPipe } from './intl-timeago.pipe';

describe('IntlTimeagoPipe', () => {
  let pipe: IntlTimeagoPipe;
  let cdRef: jasmine.SpyObj<ChangeDetectorRef>;
  let ngZone: jasmine.SpyObj<NgZone>;

  beforeEach(() => {
    cdRef = jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck']);
    ngZone = jasmine.createSpyObj('NgZone', ['run', 'runOutsideAngular']);
    pipe = new IntlTimeagoPipe(cdRef, ngZone, 'en-US', null, null, null);
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
      const reference = new Date(Date.UTC(2020, 11, 21));
      const then = new Date(reference.getTime() - offsetSeconds * 1000);
      expect(pipe.transform(then, { reference })).toEqual(expected);
    });
    it(`should format number as ${expected}`, () => {
      const reference = new Date(Date.UTC(2020, 11, 21)).getTime();
      const then = reference - offsetSeconds * 1000;
      expect(pipe.transform(then, { reference })).toEqual(expected);
    });
  }

  it('should format null', () => {
    const result = pipe.transform(null);
    expect(result).toBeNull();
  });

  it('should format undefined', () => {
    const result = pipe.transform(undefined);
    expect(result).toBeNull();
  });

  it('should use preset by string', () => {
    pipe = new IntlTimeagoPipe(cdRef, ngZone, 'en-US', {presets: {custom: {style: 'short'}}}, null, null);
    const then = new Date(new Date().getTime() - 1 * 60 * 60 * 24 * 365 / 12 * 2 * 1000);
    const result = pipe.transform(then, 'custom');
    expect(result).toEqual('2 mo. ago');
  });

  it('should use preset by options', () => {
    pipe = new IntlTimeagoPipe(cdRef, ngZone, 'en-US', {presets: {custom: {style: 'short'}}}, null, null);
    const reference = new Date(Date.UTC(2020, 11, 21));
    const then = new Date(Date.UTC(2020, 9, 21));
    const result = pipe.transform(then, { reference, preset: 'custom' });
    expect(result).toEqual('2 mo. ago');
  });

  it('should use overrides', () => {
    pipe = new IntlTimeagoPipe(cdRef, ngZone, 'en-US', {presets: {custom: {style: 'short'}}}, null, null);
    const reference = new Date(Date.UTC(2020, 11, 21));
    const then = new Date(Date.UTC(2020, 9, 21));
    const result = pipe.transform(then, { reference, preset: 'custom', style: 'long' });
    expect(result).toEqual('2 months ago');
  });

  it('should use default', () => {
    pipe = new IntlTimeagoPipe(cdRef, ngZone, 'en-US', {presets: {custom: {style: 'short'}}, defaultPreset: 'custom'}, null, null);
    const reference = new Date(Date.UTC(2020, 11, 21));
    const then = new Date(Date.UTC(2020, 9, 21));
    const result = pipe.transform(then, { reference });
    expect(result).toEqual('2 mo. ago');
  });

  it('should format with minRelative', () => {
    const reference = new Date(Date.UTC(2020, 11, 21));
    const then = new Date(Date.UTC(2020, 11, 20) + 1000);
    expect(pipe.transform(then, { reference, minRelative: 1 * 60 * 60 * 24 })).toEqual('');
  });

  it('should format with minRelative with options', () => {
    const reference = new Date(Date.UTC(2020, 11, 21));
    const then = new Date(Date.UTC(2020, 11, 20) + 1000);
    expect(pipe.transform(then, { reference, minRelative: 1 * 60 * 60 * 24, now: 'Now' })).toEqual('Now');
  });

  it('should format with maxRelative', () => {
    const reference = new Date(Date.UTC(2020, 11, 21));
    const then = new Date(Date.UTC(2020, 11, 20));
    expect(pipe.transform(then, { reference, maxRelative: 1 * 60 * 60 * 24 })).toEqual('12/20/2020');
  });

  it('should format with maxRelative with options', () => {
    const reference = new Date(Date.UTC(2020, 11, 21));
    const then = new Date(Date.UTC(2020, 11, 20));
    expect(pipe.transform(then, { reference, maxRelative: 1 * 60 * 60 * 24, dateOptions: 'shortDate' })).toEqual('12/20/20');
  });

  it('should format with restricted units', () => {
    const reference = new Date(Date.UTC(2020, 11, 21));
    const then = new Date(Date.UTC(2020, 11, 20));
    expect(pipe.transform(then, { reference, units: ['second', 'minute', 'hour'] })).toEqual('24 hours ago');
  });

  it('should format with restricted units (only larger)', () => {
    const reference = new Date(Date.UTC(2020, 11, 21));
    const then = new Date(Date.UTC(2020, 11, 20));
    expect(pipe.transform(then, { reference, units: ['quarter', 'year'] })).toEqual('0 quarters ago');
  });

  it('should format with restricted units (empty)', () => {
    const reference = new Date(Date.UTC(2020, 11, 21));
    const then = new Date(Date.UTC(2020, 11, 20));
    expect(pipe.transform(then, { reference, units: [] })).toEqual('86,400 seconds ago');
  });
});
