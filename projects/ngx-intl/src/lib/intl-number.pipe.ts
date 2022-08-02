import { Inject, InjectionToken, LOCALE_ID, Optional, Pipe, PipeTransform } from '@angular/core';

export interface IntlNumberOptions extends Intl.NumberFormatOptions {
  preset?: string
}

export interface IntlNumberGlobalOptions {
  presets?: { [key: string]: Intl.NumberFormatOptions },
  defaultPreset?: string
}

export const INTL_NUMBER_OPTIONS =
  new InjectionToken<IntlNumberGlobalOptions>('IntlNumberOptions');

export const INTL_NUMBER_PRESET_SHORT: Intl.NumberFormatOptions =
  { useGrouping: false, maximumFractionDigits: 2 };
export const INTL_NUMBER_PRESET_LONG: Intl.NumberFormatOptions =
  { maximumFractionDigits: 8 };
export const INTL_NUMBER_PRESET_CURRENCY: Intl.NumberFormatOptions =
  { style: 'currency', currency: 'USD' };
export const INTL_NUMBER_PRESET_PERCENT: Intl.NumberFormatOptions =
  { style: 'percent' };

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
      percent: INTL_NUMBER_PRESET_PERCENT,
    }
  };

  constructor(
    @Inject(LOCALE_ID) private readonly locale: string,
    @Inject(INTL_NUMBER_OPTIONS) @Optional() private readonly options: IntlNumberGlobalOptions | null
  ) {}

  transform(value: number | bigint | null, options?: string | IntlNumberOptions, ...locales: string[]): string | null {
    return value !== null ? new Intl.NumberFormat(this.getLocales(locales), this.getOptions(options)).format(value) : null;
  }

  private getLocales(locales: string[]): string[] {
    return [...locales, this.locale];
  }

  private getOptions(options?: string | IntlNumberOptions): Intl.NumberFormatOptions {
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
