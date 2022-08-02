import { Inject, InjectionToken, LOCALE_ID, Optional, Pipe, PipeTransform } from '@angular/core';

export interface IntlPluralOptions extends Intl.PluralRulesOptions {
  preset?: string;
}

export interface IntlPluralGlobalOptions {
  presets?: { [key: string]: Intl.PluralRulesOptions };
  defaultPreset?: string;
}

export const INTL_PLURAL_OPTIONS =
  new InjectionToken<IntlPluralGlobalOptions>('IntlPluralOptions');

export const INTL_PLURAL_PRESET_CARDINAL: Intl.PluralRulesOptions =
  { type: 'cardinal' };
export const INTL_PLURAL_PRESET_ORDINAL: Intl.PluralRulesOptions =
  { type: 'ordinal' };

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

  transform(value: number | null, options?: string | IntlPluralOptions, ...locales: string[]): string | null {
    return value !== null ? new Intl.PluralRules(this.getLocales(locales), this.getOptions(options)).select(value) : null;
  }

  private getLocales(locales: string[]): string[] {
    return [...locales, this.locale];
  }

  private getOptions(options?: string | IntlPluralOptions): Intl.PluralRulesOptions {
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
