# Angular Intl

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.

## What is Intl?

The Intl object is the namespace for the ECMAScript Internationalization API, which provides language sensitive string comparison, number formatting, and date and time formatting. For more information, take a look at the [mdm web docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).

## Changelog

The latest changes are available within this repository in the project's [CHANGELOG](https://github.com/haiilo/ngx-intl/blob/main/projects/ngx-intl/CHANGELOG.md) file.

## `intl-date`

Format a date according to locale and formatting options.

### Description

Just like the Angular [DatePipe](https://angular.io/api/common/DatePipe), IntlDatePipe is executed only when it detects a pure change to the input value. A pure change is either a change to a primitive input value (such as String, Number, Boolean, or Symbol), or a changed object reference (such as Date, Array, Function, or Object).

Note that mutating a Date object does not cause the pipe to be rendered again. To ensure that the pipe is executed, you must create a new Date object.

The default locale used for formatting is the one provided by the Angular [`LOCALE_ID`](https://angular.io/api/core/LOCALE_ID) injection token. See the I18n guide for more information. It can also be passed into the pipe as a third parameter.

The time zone of the formatted value can be specified either by passing it in as a property of the second parameter of the pipe, or by setting the default through the `INTL_DATE_TIMEZONE` injection token. The value that is passed in as the second parameter takes precedence over the one defined using the injection token.

### Pre-defined format options

The pipe comes with a set of pre-defined format options as shown below.

| Option        | Examples (given in `en-US` locale)              |
|---------------|-------------------------------------------------|
| `'short'`     | `6/15/15, 9:03 AM`                              |
| `'medium'`    | `Jun 15, 2015, 9:03:01 AM`                      |
| `'long'`      | `June 15, 2015 at 9:03:01 AM GMT+1`             |
| `'full'`      | `Monday, June 15, 2015 at 9:03:01 AM GMT+01:00` |
| `'shortDate'` | `6/15/15`                                       |
| `'mediumDate'`| `Jun 15, 2015`                                  |
| `'longDate'`  | `June 15, 2015`                                 |
| `'fullDate'`  | `Monday, June 15, 2015`                         |
| `'shortTime'` | `9:03 AM`                                       |
| `'mediumTime'`| `9:03:01 AM`                                    |
| `'longTime'`  | `9:03:01 AM GMT+1`                              |
| `'fullTime'`  | `9:03:01 AM GMT+01:00`                          |

### Presets and custom configuration

You can add custom configuration and presets using the `INTL_DATE_OPTIONS` injection token. This allows the definition of additional presets as well as setting a default preset, which is used if no preset name is provided to the pipe.

```
@NgModule({
  //…,
  providers: [
    //…,
    {
      provide: INTL_DATE_OPTIONS,
      useValue: {
        defaultPreset: 'custom'
        presets: {
          custom: {
            dateStyle: 'short'
          }
        }
      }
    }
  ]
})
```

### API

| Parameter    | Type                                  | Description           |
|--------------|---------------------------------------|-----------------------|
| `value`      | `Date \| number \| null \| undefined` |                       |
| `options`    | `string \| IntlDateOptions`           |                       |
| `...locales` | `string[]`                            |                       |

### Browser compatibility

See [mdn web docs | Browser compatibility](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format#browser_compatibility).

## `intl-list`

Format a list according to locale and formatting options.

### Description

The IntlListPipe transforms a list based on parameters provided in the options. The locales and options parameters customize the behavior of the pipe and let applications specify the language conventions that should be used to format the list.

### Pre-defined format options

The pipe comes with a set of pre-defined format options as shown below.

| Option  | Examples (given in `en-US` locale) |
|---------|------------------------------------|
| `'and'` | `a, b, and c`                      |
| `'or'`  | `a, b, or c`                       |

### Presets and custom configuration

You can add custom configuration and presets using the `INTL_LIST_OPTIONS` injection token. This allows the definition of additional presets as well as setting a default preset, which is used if no preset name is provided to the pipe.

```
@NgModule({
  //…,
  providers: [
    //…,
    {
      provide: INTL_LIST_OPTIONS,
      useValue: {
        defaultPreset: 'custom'
        presets: {
          custom: {
            style: 'narrow',
            type: 'unit'
          }
        }
      }
    }
  ]
})
```

### API

| Parameter    | Type                        | Description           |
|--------------|-----------------------------|-----------------------|
| `value`      | `Iterable<string> \| null`  |                       |
| `options`    | `string \| IntlListOptions` |                       |
| `...locales` | `string[]`                  |                       |

## `intl-number`

Format a number according to locale and formatting options.

### Description
### Pre-defined format options
### Presets and custom configuration
### API

## `intl-plural`
### Description
### Pre-defined format options
### Presets and custom configuration
### API

## `intl-sort`
### Description
### Pre-defined format options
### Presets and custom configuration
### API

## Code Contributors

This project exists thanks to all the people who contribute.

<a href="https://github.com/haiilo/ngx-intl/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=haiilo/ngx-intl" />
</a>

## License

The license is available within this repository in the
[LICENSE](https://github.com/haiilo/ngx-intl/blob/main/LICENSE) file.
