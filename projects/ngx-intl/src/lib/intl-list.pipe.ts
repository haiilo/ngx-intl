// import { Inject, InjectionToken, LOCALE_ID, Optional, Pipe, PipeTransform } from '@angular/core';

// /** A preconfigured option preset for the IntlListPipe. */
// export interface IntlListOptions extends Intl.ListFormatOptions {}

// /** Global options and presets for the IntlListPipe. */
// export interface IntlListGlobalOptions {
//   presets?: { [key: string]: IntlListOptions };
//   defaultPreset?: string;
// }

// /** Options for a transform call of the IntlListPipe. */
// export interface IntlListLocalOptions extends IntlListOptions {
//   preset?: string;
// }

// export const INTL_LIST_OPTIONS =
//   new InjectionToken<IntlListGlobalOptions>('IntlListOptions');

// export const INTL_LIST_PRESET_AND: IntlListOptions =
//   { type: 'conjunction' };
// export const INTL_LIST_PRESET_OR: IntlListOptions =
//   { type: 'disjunction' };

// @Pipe({
//   name: 'IntlList',
//   standalone: true
// })
// export class IntlListPipe implements PipeTransform {
//   private static readonly DEFAULT_OPTIONS: IntlListGlobalOptions = {
//     presets: {
//       and: INTL_LIST_PRESET_AND,
//       or: INTL_LIST_PRESET_OR
//     }
//   };

//   constructor(
//     @Inject(LOCALE_ID) private readonly locale: string,
//     @Inject(INTL_LIST_OPTIONS) @Optional() private readonly options: IntlListGlobalOptions | null
//   ) {}

//   transform(value: Iterable<string> | null, options?: string | IntlListLocalOptions, ...locales: string[]): string | null {
//     if (value === null) {
//       return null;
//     }

//     const _locales = this.getLocales(locales);
//     const _options = this.getOptions(options);
//     return new Intl.ListFormat(_locales, _options).format(value);
//   }

//   private getLocales(locales: string[]): string[] {
//     return [...locales, this.locale];
//   }

//   private getOptions(options?: string | IntlListLocalOptions): IntlListOptions {
//     const presetStr = typeof options === 'string';
//     const presetKey = !presetStr
//       ? options?.preset || this.options?.defaultPreset || IntlListPipe.DEFAULT_OPTIONS.defaultPreset
//       : options;
//     const preset = presetKey
//       ? (this.options?.presets?.[presetKey] || IntlListPipe.DEFAULT_OPTIONS.presets?.[presetKey])
//       : undefined;
//     return {...preset, ...(!presetStr ? options : undefined)};
//   }
// }
