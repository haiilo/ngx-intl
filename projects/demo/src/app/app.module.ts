import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { IntlTimeagoPipe } from 'projects/ngx-intl/src/lib/intl-timeago.pipe';

@NgModule({
  imports: [BrowserModule, IntlTimeagoPipe],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
