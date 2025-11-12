import { Component } from '@angular/core';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BookingFormComponent, LanguageSwitcherComponent],
  template: `
    <app-language-switcher></app-language-switcher>
    <app-booking-form></app-booking-form>
  `,
  styles: []
})
export class AppComponent {
  title = 'booking-system';
}
