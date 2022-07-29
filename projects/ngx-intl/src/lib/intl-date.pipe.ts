import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'intlDate',
  standalone: true
})
export class IntlDatePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
