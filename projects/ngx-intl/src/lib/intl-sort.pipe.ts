import { Inject, InjectionToken, LOCALE_ID, Optional, Pipe, PipeTransform } from '@angular/core';

/** A preconfigured option preset for the IntlSortPipe. */
export interface IntlSortOptions extends Intl.CollatorOptions {}

/** Global options and presets for the IntlSortPipe. */
export interface IntlSortGlobalOptions {
  presets?: { [key: string]: IntlSortOptions };
  defaultPreset?: string;
}

/** Options for a transform call of the IntlSortPipe. */
export interface IntlSortLocalOptions extends IntlSortOptions {
  preset?: string;
}

export const INTL_SORT_OPTIONS =
  new InjectionToken<IntlSortGlobalOptions>('IntlSortOptions');

export const INTL_SORT_PRESET_LOWER_FIRST: IntlSortOptions =
  { caseFirst: 'lower' };
export const INTL_SORT_PRESET_UPPER_FIRST: IntlSortOptions =
  { caseFirst: 'upper' };

/**
 * A pipe that sorts an array of strings using the Intl.Collator API.
 */
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

  transform(value: string[] | null, options?: string | IntlSortLocalOptions, ...locales: string[]): string[] | null {
    if (value === null) {
      return null;
    }

    const _locales = this.getLocales(locales);
    const _options = this.getOptions(options);
    return value.sort(new Intl.Collator(_locales, _options).compare);
  }

  private getLocales(locales: string[]): string[] {
    return [...locales, this.locale];
  }

  private getOptions(options?: string | IntlSortLocalOptions): IntlSortOptions {
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
