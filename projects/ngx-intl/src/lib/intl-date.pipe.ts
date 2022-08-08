import { Inject, InjectionToken, LOCALE_ID, Optional, Pipe, PipeTransform } from '@angular/core';

/** A preconfigured option preset for the IntlDatePipe. */
export interface IntlDateOptions extends Intl.DateTimeFormatOptions {}

/** Global options and presets for the IntlDatePipe. */
export interface IntlDateGlobalOptions {
  presets?: { [key: string]: IntlDateOptions };
  defaultPreset?: string;
}

/** Options for a transform call of the IntlDatePipe. */
export interface IntlDateLocalOptions extends IntlDateOptions {
  preset?: string;
}

export const INTL_DATE_OPTIONS =
  new InjectionToken<IntlDateGlobalOptions>('IntlDateOptions');

export const INTL_DATE_TIMEZONE =
  new InjectionToken<string>('IntlDateTimezone');

export const INTL_DATE_PRESET_SHORT: IntlDateOptions =
  { dateStyle: 'short', timeStyle: 'short' };
export const INTL_DATE_PRESET_MEDIUM: IntlDateOptions =
  { dateStyle: 'medium', timeStyle: 'medium' };
export const INTL_DATE_PRESET_LONG: IntlDateOptions =
  { dateStyle: 'long', timeStyle: 'long' };
export const INTL_DATE_PRESET_FULL: IntlDateOptions =
  { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'long' };
export const INTL_DATE_PRESET_SHORT_DATE: IntlDateOptions =
  { dateStyle: 'short' };
export const INTL_DATE_PRESET_MEDIUM_DATE: IntlDateOptions =
  { dateStyle: 'medium' };
export const INTL_DATE_PRESET_LONG_DATE: IntlDateOptions =
  { dateStyle: 'long' };
export const INTL_DATE_PRESET_FULL_DATE: IntlDateOptions =
  { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
export const INTL_DATE_PRESET_SHORT_TIME: IntlDateOptions =
  { timeStyle: 'short' };
export const INTL_DATE_PRESET_MEDIUM_TIME: IntlDateOptions =
  { timeStyle: 'medium' };
export const INTL_DATE_PRESET_LONG_TIME: IntlDateOptions =
  { timeStyle: 'long' };
export const INTL_DATE_PRESET_FULL_TIME: IntlDateOptions =
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
    @Inject(INTL_DATE_OPTIONS) @Optional() private readonly options: IntlDateGlobalOptions | null,
    @Inject(INTL_DATE_TIMEZONE) @Optional() private readonly timezone: string | null
  ) {}

  transform(value?: Date | number | null, options?: string | IntlDateLocalOptions, ...locales: string[]): string | null {
    if (value === null) {
      return null;
    }

    const _locales = this.getLocales(locales);
    const _options = this.getOptions(options);
    return new Intl.DateTimeFormat(_locales, _options).format(value);
  }

  private getLocales(locales: string[]): string[] {
    return [...locales, this.locale];
  }

  private getOptions(options?: string | IntlDateLocalOptions): IntlDateOptions {
    const presetStr = typeof options === 'string';
    const presetKey = !presetStr
      ? options?.preset || this.options?.defaultPreset || IntlDatePipe.DEFAULT_OPTIONS.defaultPreset
      : options;
    const preset = presetKey
      ? (this.options?.presets?.[presetKey] || IntlDatePipe.DEFAULT_OPTIONS.presets?.[presetKey])
      : undefined;
    const timezone = this.timezone ? { timeZone: this.timezone } : {};
    return {...timezone, ...preset, ...(!presetStr ? options : undefined)};
  }
}
