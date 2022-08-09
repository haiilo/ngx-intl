import { Inject, InjectionToken, LOCALE_ID, Optional, Pipe, PipeTransform } from '@angular/core';
import { IntlDateGlobalOptions, IntlDateLocalOptions, IntlDatePipe, INTL_DATE_OPTIONS, INTL_DATE_TIMEZONE } from './intl-date.pipe';

const UNITS: {[key in Intl.RelativeTimeFormatUnit]: number} = {
  year: 1 * 60 * 60 * 24 * 365,
  years: 1 * 60 * 60 * 24 * 365,
  quarter: 1 * 60 * 60 * 24 * 365 / 4,
  quarters: 1 * 60 * 60 * 24 * 365 / 4,
  month: 1 * 60 * 60 * 24 * 365 / 12,
  months: 1 * 60 * 60 * 24 * 365 / 12,
  week: 1 * 60 * 60 * 24 * 7,
  weeks: 1 * 60 * 60 * 24 * 7,
  day: 1 * 60 * 60 * 24,
  days: 1 * 60 * 60 * 24,
  hour: 1 * 60 * 60,
  hours: 1 * 60 * 60,
  minute: 1 * 60,
  minutes: 1 * 60,
  second: 1,
  seconds: 1
};

/** A preconfigured option preset for the IntlTimeagoPipe. */
export interface IntlTimeagoOptions extends Intl.RelativeTimeFormatOptions {
  now?: Date | number;
  units?: Intl.RelativeTimeFormatUnit[];
  maxRelative?: number;
  dateOptions?: string | IntlDateLocalOptions;
}

/** Global options and presets for the IntlTimeagoPipe. */
export interface IntlTimeagoGlobalOptions {
  presets?: { [key: string]: IntlTimeagoOptions };
  defaultPreset?: string;
  units?: Intl.RelativeTimeFormatUnit[];
  maxRelative?: number;
  dateOptions?: string | IntlDateLocalOptions;
}

/** Options for a transform call of the IntlTimeagoPipe. */
export interface IntlTimeagoLocalOptions extends IntlTimeagoOptions {
  preset?: string;
}

export const INTL_TIMEAGO_OPTIONS =
  new InjectionToken<IntlTimeagoGlobalOptions>('IntlTimeagoOptions');

export const INTL_TIMEAGO_PRESET_SHORT: IntlTimeagoOptions =
  { style: 'short', dateOptions: 'shortDate' };
export const INTL_TIMEAGO_PRESET_LONG: IntlTimeagoOptions =
  { style: 'long', dateOptions: 'mediumDate' };

@Pipe({
  name: 'intlTimeago',
  standalone: true
})
export class IntlTimeagoPipe implements PipeTransform {
  private readonly intlDatePipe: IntlDatePipe
  private static readonly DEFAULT_OPTIONS: IntlTimeagoGlobalOptions = {
    presets: {
      short: INTL_TIMEAGO_PRESET_SHORT,
      long: INTL_TIMEAGO_PRESET_LONG,
    }
  };

  constructor(
    @Inject(LOCALE_ID) private readonly locale: string,
    @Inject(INTL_TIMEAGO_OPTIONS) @Optional() private readonly options: IntlTimeagoGlobalOptions | null,
    @Inject(INTL_DATE_OPTIONS) @Optional() dateOptions: IntlDateGlobalOptions | null,
    @Inject(INTL_DATE_TIMEZONE) @Optional() dateTimezone: string | null
  ) {
    this.intlDatePipe = new IntlDatePipe(locale, dateOptions, dateTimezone);
  }

  transform(value?: Date | number | null, options?: string | IntlTimeagoLocalOptions, ...locales: string[]): string | null {
    if (value === null) {
      return null;
    }

    const _locales = this.getLocales(locales);
    const _options = this.getOptions(options);

    const now = new Date(_options.now ?? new Date());
    const then = new Date(value ?? new Date());
    const seconds = Math.abs(Math.ceil((then.getTime() - now.getTime()) / 1000));
    const maxRelative = _options.maxRelative ?? IntlTimeagoPipe.DEFAULT_OPTIONS.maxRelative ?? -1;
    if (seconds <= maxRelative) {
      return this.intlDatePipe.transform(then, _options.dateOptions, ..._locales);
    }
    
    const allowed = _options.units ?? IntlTimeagoPipe.DEFAULT_OPTIONS.units;
    const unit = this.getUnit(now, then, allowed);
    const diff = this.getDiff(now, then, unit);
    return new Intl.RelativeTimeFormat(this.getLocales(locales), this.getOptions(options)).format(diff, unit);
  }

  private getUnit(now: Date, then: Date, allowed?: Intl.RelativeTimeFormatUnit[]): Intl.RelativeTimeFormatUnit {
    const seconds = Math.abs(Math.ceil((now.getTime() - then.getTime()) / 1000));
    const units = Object.entries(UNITS)
      .sort(([, a], [, b]) => a - b)
      .filter(([u, v]) => seconds >= v && (allowed?.includes(u as Intl.RelativeTimeFormatUnit) ?? true))
      .reverse();
    return units?.[0]?.[0] as Intl.RelativeTimeFormatUnit ?? allowed?.sort((a, b) => UNITS[a] - UNITS[b])?.[0] ?? 'second';
  }

  private getDiff(now: Date, then: Date, unit: Intl.RelativeTimeFormatUnit): number {
    return Math.ceil((then.getTime() - now.getTime()) / 1000 / UNITS[unit]);
  }

  private getLocales(locales: string[]): string[] {
    return [...locales, this.locale];
  }

  private getOptions(options?: string | IntlTimeagoLocalOptions): IntlTimeagoOptions {
    const presetStr = typeof options === 'string';
    const presetKey = !presetStr
      ? options?.preset || this.options?.defaultPreset || IntlTimeagoPipe.DEFAULT_OPTIONS.defaultPreset
      : options;
    const preset = presetKey
      ? (this.options?.presets?.[presetKey] || IntlTimeagoPipe.DEFAULT_OPTIONS.presets?.[presetKey])
      : undefined;
    return {...preset, ...(!presetStr ? options : undefined)};
  }
}
