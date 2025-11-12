import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoService } from '@jsverse/transloco';

interface Language {
  code: string;
  name: string;
  flag: string;
}

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css']
})
export class LanguageSwitcherComponent {
  private translocoService = inject(TranslocoService);

  languages: Language[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'zu', name: 'IsiZulu', flag: '🇿🇦' },
    { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
    { code: 'xh', name: 'IsiXhosa', flag: '🇿🇦' }
  ];

  get currentLang(): string {
    return this.translocoService.getActiveLang();
  }

  get currentLanguage(): Language {
    return this.languages.find(lang => lang.code === this.currentLang) || this.languages[0];
  }

  changeLanguage(langCode: string): void {
    this.translocoService.setActiveLang(langCode);
  }
}
