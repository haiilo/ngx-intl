import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '{{ now | intlTimeago }}',
})
export class AppComponent {
  now = new Date().getTime() - 55 * 1000;
}
