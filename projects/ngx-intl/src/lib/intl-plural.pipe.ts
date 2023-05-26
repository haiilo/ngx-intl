import { Inject, InjectionToken, LOCALE_ID, Optional, Pipe, PipeTransform } from '@angular/core';

/** A preconfigured option preset for the IntlPluralPipe. */
export interface IntlPluralOptions extends Intl.PluralRulesOptions {}

/** Global options and presets for the IntlPluralPipe. */
export interface IntlPluralGlobalOptions {
  presets?: { [key: string]: IntlPluralOptions };
  defaultPreset?: string;
}

/** Options for a transform call of the IntlPluralPipe. */
export interface IntlPluralLocalOptions extends IntlPluralOptions {
  preset?: string;
}

export const INTL_PLURAL_OPTIONS =
  new InjectionToken<IntlPluralGlobalOptions>('IntlPluralOptions');

export const INTL_PLURAL_PRESET_CARDINAL: IntlPluralOptions =
  { type: 'cardinal' };
export const INTL_PLURAL_PRESET_ORDINAL: IntlPluralOptions =
  { type: 'ordinal' };

/**
 * A pipe that pluralizes a string using the Intl.PluralRules API.
 */
@Pipe({
  name: 'IntlPlural',
  standalone: true
})
export class IntlPluralPipe implements PipeTransform {
  private static readonly DEFAULT_OPTIONS: IntlPluralGlobalOptions = {
    presets: {
      cardinal: INTL_PLURAL_PRESET_CARDINAL,
      ordinal: INTL_PLURAL_PRESET_ORDINAL
    }
  };

  constructor(
    @Inject(LOCALE_ID) private readonly locale: string,
    @Inject(INTL_PLURAL_OPTIONS) @Optional() private readonly options: IntlPluralGlobalOptions | null
  ) {}

  transform(value: number | null, options?: string | IntlPluralLocalOptions, ...locales: string[]): string | null {
    if (value === null) {
      return null;
    }

    const _locales = this.getLocales(locales);
    const _options = this.getOptions(options);
    return new Intl.PluralRules(_locales, _options).select(value);
  }

  private getLocales(locales: string[]): string[] {
    return [...locales, this.locale];
  }

  private getOptions(options?: string | IntlPluralLocalOptions): IntlPluralOptions {
    const presetStr = typeof options === 'string';
    const presetKey = !presetStr
      ? options?.preset || this.options?.defaultPreset || IntlPluralPipe.DEFAULT_OPTIONS.defaultPreset
      : options;
    const preset = presetKey
      ? (this.options?.presets?.[presetKey] || IntlPluralPipe.DEFAULT_OPTIONS.presets?.[presetKey])
      : undefined;
    return {...preset, ...(!presetStr ? options : undefined)};
  }
}
