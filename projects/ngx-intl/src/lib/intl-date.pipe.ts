import { Inject, InjectionToken, LOCALE_ID, Optional, Pipe, PipeTransform } from '@angular/core';

export interface IntlDateOptions extends Intl.DateTimeFormatOptions {
  preset?: string
}

export interface IntlDateGlobalOptions {
  presets?: { [key: string]: Intl.DateTimeFormatOptions }
}

export const INTL_DATE_OPTIONS =
  new InjectionToken<IntlDateGlobalOptions>('IntlDateOptions');

@Pipe({
  name: 'intlDate',
  standalone: true
})
export class IntlDatePipe implements PipeTransform {

  constructor(
    @Inject(LOCALE_ID) private readonly locale: string,
    @Inject(INTL_DATE_OPTIONS) @Optional() private readonly options: IntlDateGlobalOptions | null
  ) {}

  transform(value?: Date | number | null, options?: string | IntlDateOptions, ...locales: string[]): string | null {
    return value !== null ? new Intl.DateTimeFormat(this.getLocales(locales), this.getOptions(options)).format(value) : null;
  }

  private getLocales(locales: string[]) {
    return [...locales, this.locale];
  }

  private getOptions(options?: string | IntlDateOptions) {
    const presetKey = typeof options === 'string' ? options : options?.preset;
    const preset = presetKey ? this.options?.presets?.[presetKey] : undefined;
    return {...preset, ...(typeof options !== 'string' ? options : undefined)};
  }
}
