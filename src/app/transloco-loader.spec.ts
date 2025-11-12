import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslocoHttpLoader } from './transloco-loader';
import { Translation } from '@jsverse/transloco';

describe('TranslocoHttpLoader', () => {
  let loader: TranslocoHttpLoader;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TranslocoHttpLoader]
    });
    loader = TestBed.inject(TranslocoHttpLoader);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(loader).toBeTruthy();
  });

  describe('getTranslation', () => {
    it('should load English translations', () => {
      const mockTranslation: Translation = {
        title: 'Schedule Your Branch Appointment',
        subtitle: 'Please fill in your details to book an appointment',
        loading: 'Loading available branches and services...',
        form: {
          firstName: {
            label: 'First Name',
            placeholder: 'Enter your first name',
            required: 'First name is required'
          }
        },
        buttons: {
          clear: 'Clear',
          submit: 'Book Appointment'
        }
      };

      loader.getTranslation('en').subscribe((translation) => {
        expect(translation).toEqual(mockTranslation);
        expect(translation['title']).toBe('Schedule Your Branch Appointment');
      });

      const req = httpMock.expectOne('/i18n/en.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockTranslation);
    });

    it('should load Zulu translations', () => {
      const mockTranslation: Translation = {
        title: 'Hlela Isikhathi Sakho Sokuhlangana Ehhovisi',
        subtitle: 'Sicela ugcwalise imininingwane yakho ukuze ubhukhe isikhathi sokuhlangana',
        loading: 'Iyalayisha amahhovisi namasevisi atholakalayo...'
      };

      loader.getTranslation('zu').subscribe((translation) => {
        expect(translation).toEqual(mockTranslation);
        expect(translation['title']).toBe('Hlela Isikhathi Sakho Sokuhlangana Ehhovisi');
      });

      const req = httpMock.expectOne('/i18n/zu.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockTranslation);
    });

    it('should load Afrikaans translations', () => {
      const mockTranslation: Translation = {
        title: 'Skeduleer Jou Tak Afspraak',
        subtitle: 'Vul asseblief jou besonderhede in om \'n afspraak te bespreek'
      };

      loader.getTranslation('af').subscribe((translation) => {
        expect(translation).toEqual(mockTranslation);
        expect(translation['title']).toBe('Skeduleer Jou Tak Afspraak');
      });

      const req = httpMock.expectOne('/i18n/af.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockTranslation);
    });

    it('should load Xhosa translations', () => {
      const mockTranslation: Translation = {
        title: 'Cwangcisa Ixesha Lakho Lentlanganiso Kwisebe',
        subtitle: 'Nceda uzalise iinkcukacha zakho ukuze ubhukishe ixesha lentlanganiso'
      };

      loader.getTranslation('xh').subscribe((translation) => {
        expect(translation).toEqual(mockTranslation);
        expect(translation['title']).toBe('Cwangcisa Ixesha Lakho Lentlanganiso Kwisebe');
      });

      const req = httpMock.expectOne('/i18n/xh.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockTranslation);
    });

    it('should handle errors when loading translations', () => {
      loader.getTranslation('en').subscribe({
        next: () => fail('should have failed with an error'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne('/i18n/en.json');
      req.flush('Translation file not found', { status: 404, statusText: 'Not Found' });
    });

    it('should request the correct path for each language', () => {
      const languages = ['en', 'zu', 'af', 'xh'];

      languages.forEach((lang) => {
        loader.getTranslation(lang).subscribe();
        const req = httpMock.expectOne(`/i18n/${lang}.json`);
        expect(req.request.method).toBe('GET');
        req.flush({});
      });
    });
  });
});
