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
    pipe = new IntlDatePipe('en-US', {presets: {short: {dateStyle: 'short'}}});
    const date = new Date(Date.UTC(2020, 11, 20));
    const result = pipe.transform(date, { preset: 'short' });
    expect(result).toEqual('12/20/20');
  });

  it('should ue overrides', () => {
    pipe = new IntlDatePipe('en-US', {presets: {short: {dateStyle: 'short'}}});
    const date = new Date(Date.UTC(2020, 11, 20));
    const result = pipe.transform(date, { preset: 'short', dateStyle: 'long' });
    expect(result).toEqual('December 20, 2020');
  });
});
