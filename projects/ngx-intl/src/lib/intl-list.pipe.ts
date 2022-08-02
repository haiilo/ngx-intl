import { Inject, InjectionToken, LOCALE_ID, Optional, Pipe, PipeTransform } from '@angular/core';

export interface IntlListOptions extends Intl.ListFormatOptions {
  preset?: string
}

export interface IntlListGlobalOptions {
  presets?: { [key: string]: Intl.ListFormatOptions },
  defaultPreset?: string
}

export const INTL_LIST_OPTIONS =
  new InjectionToken<IntlListGlobalOptions>('IntlListOptions');

export const INTL_LIST_PRESET_AND: Intl.ListFormatOptions =
  { type: 'conjunction' };
export const INTL_LIST_PRESET_OR: Intl.ListFormatOptions =
  { type: 'disjunction' };

@Pipe({
  name: 'IntlList',
  standalone: true
})
export class IntlListPipe implements PipeTransform {
  private static readonly DEFAULT_OPTIONS: IntlListGlobalOptions = {
    presets: {
      and: INTL_LIST_PRESET_AND,
      or: INTL_LIST_PRESET_OR,
    }
  };

  constructor(
    @Inject(LOCALE_ID) private readonly locale: string,
    @Inject(INTL_LIST_OPTIONS) @Optional() private readonly options: IntlListGlobalOptions | null
  ) {}

  transform(value: Iterable<string> | null, options?: string | IntlListOptions, ...locales: string[]): string | null {
    return value !== null ? new Intl.ListFormat(this.getLocales(locales), this.getOptions(options)).format(value) : null;
  }

  private getLocales(locales: string[]): string[] {
    return [...locales, this.locale];
  }

  private getOptions(options?: string | IntlListOptions): Intl.ListFormatOptions {
    const presetStr = typeof options === 'string';
    const presetKey = !presetStr
      ? options?.preset || this.options?.defaultPreset || IntlListPipe.DEFAULT_OPTIONS.defaultPreset
      : options;
    const preset = presetKey
      ? (this.options?.presets?.[presetKey] || IntlListPipe.DEFAULT_OPTIONS.presets?.[presetKey])
      : undefined;
    return {...preset, ...(!presetStr ? options : undefined)};
  }
}
