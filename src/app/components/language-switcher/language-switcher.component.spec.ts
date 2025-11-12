import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSwitcherComponent } from './language-switcher.component';
import { TranslocoService } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LanguageSwitcherComponent', () => {
  let component: LanguageSwitcherComponent;
  let fixture: ComponentFixture<LanguageSwitcherComponent>;
  let translocoService: jest.Mocked<TranslocoService>;

  const mockTranslocoService = {
    getActiveLang: jest.fn(),
    setActiveLang: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LanguageSwitcherComponent,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: TranslocoService, useValue: mockTranslocoService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    component = fixture.componentInstance;
    translocoService = TestBed.inject(TranslocoService) as jest.Mocked<TranslocoService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have all four language options', () => {
    expect(component.languages).toHaveLength(4);
    expect(component.languages).toEqual([
      { code: 'en', name: 'English', flag: '🇬🇧' },
      { code: 'zu', name: 'IsiZulu', flag: '🇿🇦' },
      { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
      { code: 'xh', name: 'IsiXhosa', flag: '🇿🇦' }
    ]);
  });

  describe('currentLang', () => {
    it('should return the active language from TranslocoService', () => {
      translocoService.getActiveLang.mockReturnValue('en');
      expect(component.currentLang).toBe('en');
      expect(translocoService.getActiveLang).toHaveBeenCalled();
    });

    it('should return different languages based on active language', () => {
      translocoService.getActiveLang.mockReturnValue('zu');
      expect(component.currentLang).toBe('zu');

      translocoService.getActiveLang.mockReturnValue('af');
      expect(component.currentLang).toBe('af');

      translocoService.getActiveLang.mockReturnValue('xh');
      expect(component.currentLang).toBe('xh');
    });
  });

  describe('currentLanguage', () => {
    it('should return the current language object for English', () => {
      translocoService.getActiveLang.mockReturnValue('en');
      expect(component.currentLanguage).toEqual({
        code: 'en',
        name: 'English',
        flag: '🇬🇧'
      });
    });

    it('should return the current language object for Zulu', () => {
      translocoService.getActiveLang.mockReturnValue('zu');
      expect(component.currentLanguage).toEqual({
        code: 'zu',
        name: 'IsiZulu',
        flag: '🇿🇦'
      });
    });

    it('should return the current language object for Afrikaans', () => {
      translocoService.getActiveLang.mockReturnValue('af');
      expect(component.currentLanguage).toEqual({
        code: 'af',
        name: 'Afrikaans',
        flag: '🇿🇦'
      });
    });

    it('should return the current language object for Xhosa', () => {
      translocoService.getActiveLang.mockReturnValue('xh');
      expect(component.currentLanguage).toEqual({
        code: 'xh',
        name: 'IsiXhosa',
        flag: '🇿🇦'
      });
    });

    it('should return default language when active language is not found', () => {
      translocoService.getActiveLang.mockReturnValue('unknown');
      expect(component.currentLanguage).toEqual({
        code: 'en',
        name: 'English',
        flag: '🇬🇧'
      });
    });
  });

  describe('changeLanguage', () => {
    it('should call setActiveLang with the provided language code', () => {
      component.changeLanguage('zu');
      expect(translocoService.setActiveLang).toHaveBeenCalledWith('zu');
    });

    it('should change language to Afrikaans', () => {
      component.changeLanguage('af');
      expect(translocoService.setActiveLang).toHaveBeenCalledWith('af');
    });

    it('should change language to Xhosa', () => {
      component.changeLanguage('xh');
      expect(translocoService.setActiveLang).toHaveBeenCalledWith('xh');
    });

    it('should change language to English', () => {
      component.changeLanguage('en');
      expect(translocoService.setActiveLang).toHaveBeenCalledWith('en');
    });

    it('should call setActiveLang exactly once per language change', () => {
      component.changeLanguage('en');
      expect(translocoService.setActiveLang).toHaveBeenCalledTimes(1);

      component.changeLanguage('zu');
      expect(translocoService.setActiveLang).toHaveBeenCalledTimes(2);
    });
  });

  describe('Component Template', () => {
    it('should display the current language name and flag', () => {
      translocoService.getActiveLang.mockReturnValue('en');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const languageButton = compiled.querySelector('.language-button');
      expect(languageButton).toBeTruthy();
      expect(languageButton?.textContent).toContain('English');
      expect(languageButton?.textContent).toContain('🇬🇧');
    });

    it('should display dropdown icon', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const icon = compiled.querySelector('mat-icon');
      expect(icon).toBeTruthy();
      expect(icon?.textContent?.trim()).toBe('arrow_drop_down');
    });

    it('should render all language options in the menu', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const menu = compiled.querySelector('mat-menu');
      expect(menu).toBeTruthy();
    });
  });
});
