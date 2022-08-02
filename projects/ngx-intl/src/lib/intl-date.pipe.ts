import { Inject, InjectionToken, LOCALE_ID, Optional, Pipe, PipeTransform } from '@angular/core';

export interface IntlDateOptions extends Intl.DateTimeFormatOptions {
  preset?: string
}

export interface IntlDateGlobalOptions {
  presets?: { [key: string]: Intl.DateTimeFormatOptions },
  defaultPreset?: string
}

export const INTL_DATE_OPTIONS =
  new InjectionToken<IntlDateGlobalOptions>('IntlDateOptions');

export const INTL_DATE_PRESET_SHORT: Intl.DateTimeFormatOptions =
  { dateStyle: 'short', timeStyle: 'short' };
export const INTL_DATE_PRESET_MEDIUM: Intl.DateTimeFormatOptions =
  { dateStyle: 'medium', timeStyle: 'medium' };
export const INTL_DATE_PRESET_LONG: Intl.DateTimeFormatOptions =
  { dateStyle: 'long', timeStyle: 'long' };
export const INTL_DATE_PRESET_FULL: Intl.DateTimeFormatOptions =
  { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'long' };
export const INTL_DATE_PRESET_SHORT_DATE: Intl.DateTimeFormatOptions =
  { dateStyle: 'short' };
export const INTL_DATE_PRESET_MEDIUM_DATE: Intl.DateTimeFormatOptions =
  { dateStyle: 'medium' };
export const INTL_DATE_PRESET_LONG_DATE: Intl.DateTimeFormatOptions =
  { dateStyle: 'long' };
export const INTL_DATE_PRESET_FULL_DATE: Intl.DateTimeFormatOptions =
  { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
export const INTL_DATE_PRESET_SHORT_TIME: Intl.DateTimeFormatOptions =
  { timeStyle: 'short' };
export const INTL_DATE_PRESET_MEDIUM_TIME: Intl.DateTimeFormatOptions =
  { timeStyle: 'medium' };
export const INTL_DATE_PRESET_LONG_TIME: Intl.DateTimeFormatOptions =
  { timeStyle: 'long' };
export const INTL_DATE_PRESET_FULL_TIME: Intl.DateTimeFormatOptions =
  { hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'long' };

@Pipe({
  name: 'intlDate',
  standalone: true
})
export class IntlDatePipe implements PipeTransform {
  private static readonly DEFAULT_OPTIONS: IntlDateGlobalOptions = {
    presets: {
      short: INTL_DATE_PRESET_SHORT,
      medium: INTL_DATE_PRESET_MEDIUM,
      long: INTL_DATE_PRESET_LONG,
      full: INTL_DATE_PRESET_FULL,
      shortDate: INTL_DATE_PRESET_SHORT_DATE,
      mediumDate: INTL_DATE_PRESET_MEDIUM_DATE,
      longDate: INTL_DATE_PRESET_LONG_DATE,
      fullDate: INTL_DATE_PRESET_FULL_DATE,
      shortTime: INTL_DATE_PRESET_SHORT_TIME,
      mediumTime: INTL_DATE_PRESET_MEDIUM_TIME,
      longTime: INTL_DATE_PRESET_LONG_TIME,
      fullTime: INTL_DATE_PRESET_FULL_TIME
    }
  };

  constructor(
    @Inject(LOCALE_ID) private readonly locale: string,
    @Inject(INTL_DATE_OPTIONS) @Optional() private readonly options: IntlDateGlobalOptions | null
  ) {}

  transform(value?: Date | number | null, options?: string | IntlDateOptions, ...locales: string[]): string | null {
    return value !== null ? new Intl.DateTimeFormat(this.getLocales(locales), this.getOptions(options)).format(value) : null;
  }

  private getLocales(locales: string[]): string[] {
    return [...locales, this.locale];
  }

  private getOptions(options?: string | IntlDateOptions): Intl.DateTimeFormatOptions {
    const presetStr = typeof options === 'string';
    const presetKey = !presetStr
      ? options?.preset || this.options?.defaultPreset || IntlDatePipe.DEFAULT_OPTIONS.defaultPreset
      : options;
    const preset = presetKey
      ? (this.options?.presets?.[presetKey] || IntlDatePipe.DEFAULT_OPTIONS.presets?.[presetKey])
      : undefined;
    return {...preset, ...(!presetStr ? options : undefined)};
  }
}
