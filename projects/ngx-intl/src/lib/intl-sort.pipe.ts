import { Inject, InjectionToken, LOCALE_ID, Optional, Pipe, PipeTransform } from '@angular/core';

export interface IntlSortOptions extends Intl.CollatorOptions {
  preset?: string
}

export interface IntlSortGlobalOptions {
  presets?: { [key: string]: Intl.CollatorOptions },
  defaultPreset?: string
}

export const INTL_SORT_OPTIONS =
  new InjectionToken<IntlSortGlobalOptions>('IntlSortOptions');

export const INTL_SORT_PRESET_LOWER_FIRST: Intl.CollatorOptions =
  { caseFirst: 'lower' };
export const INTL_SORT_PRESET_UPPER_FIRST: Intl.CollatorOptions =
  { caseFirst: 'upper' };

@Pipe({
  name: 'IntlSort',
  standalone: true
})
export class IntlSortPipe implements PipeTransform {
  private static readonly DEFAULT_OPTIONS: IntlSortGlobalOptions = {
    presets: {
      lowerFirst: INTL_SORT_PRESET_LOWER_FIRST,
      upperFirst: INTL_SORT_PRESET_UPPER_FIRST
    }
  };

  constructor(
    @Inject(LOCALE_ID) private readonly locale: string,
    @Inject(INTL_SORT_OPTIONS) @Optional() private readonly options: IntlSortGlobalOptions | null
  ) {}

  transform(value: string[] | null, options?: string | IntlSortOptions, ...locales: string[]): string[] | null {
    return value !== null ? value.sort(new Intl.Collator(this.getLocales(locales), this.getOptions(options)).compare) : null;
  }

  private getLocales(locales: string[]): string[] {
    return [...locales, this.locale];
  }

  private getOptions(options?: string | IntlSortOptions): Intl.CollatorOptions {
    const presetStr = typeof options === 'string';
    const presetKey = !presetStr
      ? options?.preset || this.options?.defaultPreset || IntlSortPipe.DEFAULT_OPTIONS.defaultPreset
      : options;
    const preset = presetKey
      ? (this.options?.presets?.[presetKey] || IntlSortPipe.DEFAULT_OPTIONS.presets?.[presetKey])
      : undefined;
    return {...preset, ...(!presetStr ? options : undefined)};
  }
}
