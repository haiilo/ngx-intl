import { IntlNumberPipe } from './intl-number.pipe';

describe('IntlNumberPipe', () => {
  let pipe: IntlNumberPipe;

  beforeEach(() => {
    pipe = new IntlNumberPipe('en-US');
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
});
