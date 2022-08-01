import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'intlNumber',
  standalone: true
})
export class IntlNumberPipe implements PipeTransform {

  constructor(@Inject(LOCALE_ID) private readonly locale: string) {
  }

  transform(value: number | null, options?: Intl.NumberFormatOptions, ...locales: string[]): string | null {
    return value !== null ? new Intl.NumberFormat([...locales, this.locale], options).format(value) : null;
  }
}
