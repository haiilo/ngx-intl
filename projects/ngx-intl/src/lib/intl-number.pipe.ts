import { Inject, InjectionToken, LOCALE_ID, Optional, Pipe, PipeTransform } from '@angular/core';

/** A preconfigured option preset for the IntlNumberPipe. */
export interface IntlNumberOptions extends Intl.NumberFormatOptions {}

/** Global options and presets for the IntlNumberPipe. */
export interface IntlNumberGlobalOptions {
  presets?: { [key: string]: IntlNumberOptions };
  defaultPreset?: string;
}

/** Options for a transform call of the IntlNumberPipe. */
export interface IntlNumberLocalOptions extends IntlNumberOptions {
  preset?: string;
}

export const INTL_NUMBER_OPTIONS =
  new InjectionToken<IntlNumberGlobalOptions>('IntlNumberOptions');

export const INTL_NUMBER_PRESET_SHORT: IntlNumberOptions =
  { useGrouping: false, maximumFractionDigits: 2 };
export const INTL_NUMBER_PRESET_LONG: IntlNumberOptions =
  { maximumFractionDigits: 8 };
export const INTL_NUMBER_PRESET_CURRENCY: IntlNumberOptions =
  { style: 'currency', currency: 'USD' };
export const INTL_NUMBER_PRESET_PERCENT: IntlNumberOptions =
  { style: 'percent' };

/**
 * A pipe that formats a number using the Intl.NumberFormat API.
 */
@Pipe({
  name: 'intlNumber',
  standalone: true
})
export class IntlNumberPipe implements PipeTransform {
  private static readonly DEFAULT_OPTIONS: IntlNumberGlobalOptions = {
    presets: {
      short: INTL_NUMBER_PRESET_SHORT,
      long: INTL_NUMBER_PRESET_LONG,
      currency: INTL_NUMBER_PRESET_CURRENCY,
      percent: INTL_NUMBER_PRESET_PERCENT
    }
  };

  constructor(
    @Inject(LOCALE_ID) private readonly locale: string,
    @Inject(INTL_NUMBER_OPTIONS) @Optional() private readonly options: IntlNumberGlobalOptions | null
  ) {}

  transform(value: number | bigint | null, options?: string | IntlNumberLocalOptions, ...locales: string[]): string | null {
    if (value === null) {
      return null;
    }

    const _locales = this.getLocales(locales);
    const _options = this.getOptions(options);
    return new Intl.NumberFormat(_locales, _options).format(value);
  }

  private getLocales(locales: string[]): string[] {
    return [...locales, this.locale];
  }

  private getOptions(options?: string | IntlNumberLocalOptions): IntlNumberOptions {
    const presetStr = typeof options === 'string';
    const presetKey = !presetStr
      ? options?.preset || this.options?.defaultPreset || IntlNumberPipe.DEFAULT_OPTIONS.defaultPreset
      : options;
    const preset = presetKey
      ? (this.options?.presets?.[presetKey] || IntlNumberPipe.DEFAULT_OPTIONS.presets?.[presetKey])
      : undefined;
    return {...preset, ...(!presetStr ? options : undefined)};
  }
}
