import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { IntlTimeagoPipe } from 'ngx-intl';

@NgModule({
  imports: [BrowserModule, IntlTimeagoPipe],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
