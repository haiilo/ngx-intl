import { IntlDatePipe } from './intl-date.pipe';

describe('IntlDatePipe', () => {
  it('create an instance', () => {
    const pipe = new IntlDatePipe();
    expect(pipe).toBeTruthy();
  });
});
