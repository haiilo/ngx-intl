import { ChangeDetectorRef, Inject, InjectionToken, LOCALE_ID, NgZone, OnDestroy, Optional, Pipe, PipeTransform } from '@angular/core';
import { INTL_DATE_OPTIONS, INTL_DATE_TIMEZONE, IntlDateGlobalOptions, IntlDateLocalOptions, IntlDatePipe } from './intl-date.pipe';

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
  reference?: Date | number;
  units?: Intl.RelativeTimeFormatUnit[];
  now?: string;
  minRelative?: number;
  maxRelative?: number;
  dateOptions?: string | IntlDateLocalOptions;
}

/** Global options and presets for the IntlTimeagoPipe. */
export interface IntlTimeagoGlobalOptions {
  presets?: { [key: string]: IntlTimeagoOptions };
  defaultPreset?: string;
  units?: Intl.RelativeTimeFormatUnit[];
  now?: string;
  minRelative?: number;
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
  { numeric: 'auto', style: 'short', dateOptions: 'shortDate' };
export const INTL_TIMEAGO_PRESET_LONG: IntlTimeagoOptions =
  { numeric: 'auto', style: 'long', dateOptions: 'mediumDate' };

/**
 * A pipe that formats a date value to a human-readable relative-timeago string
 * using the Intl.RelativeTimeFormat API.
 */
@Pipe({
  name: 'intlTimeago',
  standalone: true,
  pure: false
})
export class IntlTimeagoPipe implements PipeTransform, OnDestroy {
  private readonly intlDatePipe: IntlDatePipe
  private static readonly DEFAULT_OPTIONS: IntlTimeagoGlobalOptions = {
    presets: {
      short: INTL_TIMEAGO_PRESET_SHORT,
      long: INTL_TIMEAGO_PRESET_LONG,
    }
  };

  private lastValue?: Date | number | null;
  private lastOptions?: string | IntlTimeagoLocalOptions;
  private lastLocales: string[] = [];
  private text: string | null = null;
  private timer?: number;
  private update?: number;
  
  constructor(
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone,
    @Inject(LOCALE_ID) private readonly locale: string,
    @Inject(INTL_TIMEAGO_OPTIONS) @Optional() private readonly options: IntlTimeagoGlobalOptions | null,
    @Inject(INTL_DATE_OPTIONS) @Optional() dateOptions: IntlDateGlobalOptions | null,
    @Inject(INTL_DATE_TIMEZONE) @Optional() dateTimezone: string | null
  ) {
    this.intlDatePipe = new IntlDatePipe(locale, dateOptions, dateTimezone);
  }

  ngOnDestroy(): void {
    this.removeTimer();
  }

  transform(value?: Date | number | null, options?: string | IntlTimeagoLocalOptions, ...locales: string[]): string | null {
    if (value !== this.lastValue || options !== this.lastOptions || locales.join() !== this.lastLocales.join()) {
      this.lastValue = value;
      this.lastOptions = options;
      this.lastLocales = locales;
      this.process();
      this.removeTimer();
      this.createTimer();
    } else {
      this.createTimer();
    }
    return this.text;
  }

  private process(): void {
    if (this.lastValue == null) {
      this.text = null;
      this.update = undefined;
      return;
    }

    const _locales = this.getLocales(this.lastLocales);
    const _options = this.getOptions(this.lastOptions);

    const now = new Date(_options.reference ?? new Date());
    const then = new Date(this.lastValue);
    const seconds = Math.abs(Math.round((then.getTime() - now.getTime()) / 1000));
    const minRelative = _options.minRelative ?? IntlTimeagoPipe.DEFAULT_OPTIONS.minRelative ?? -1;
    const maxRelative = _options.maxRelative ?? IntlTimeagoPipe.DEFAULT_OPTIONS.maxRelative ?? Number.MAX_SAFE_INTEGER;

    if (seconds < minRelative) {
      this.text = _options.now ?? IntlTimeagoPipe.DEFAULT_OPTIONS.now ?? '';
      this.update = minRelative - seconds;
    } else if (seconds >= maxRelative) {
      this.text = this.intlDatePipe.transform(then, _options.dateOptions, ..._locales);
      this.update = undefined;
    } else {
      const allowed = _options.units ?? IntlTimeagoPipe.DEFAULT_OPTIONS.units;
      const unit = this.getUnit(seconds, allowed);
      const diff = this.getDiff(now, then, unit);
      this.text = new Intl.RelativeTimeFormat(_locales, _options).format(diff, unit);
      this.update = UNITS[unit] - (seconds % UNITS[unit]);
    }
  }

  private getUnit(seconds: number, allowed?: Intl.RelativeTimeFormatUnit[]): Intl.RelativeTimeFormatUnit {
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

  private createTimer(): void {
    if (this.timer || !this.update) {
      return;
    }

    const update = this.update;
    this.timer = this.ngZone.runOutsideAngular(() => window.setTimeout(() => {
      this.process();
      this.timer = undefined;
      this.ngZone.run(() => this.cdRef.markForCheck());
    }, update * 1000));
  }

  private removeTimer(): void {
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = undefined;
    }
  }
}
