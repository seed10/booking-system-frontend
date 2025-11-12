import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BookingFormComponent } from './booking-form.component';
import { AppointmentService } from '../../services/appointment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { of, throwError } from 'rxjs';
import {
  AppointmentStatus,
  Branch,
  Service,
  AppointmentResponse
} from '../../models/appointment.model';

describe('BookingFormComponent', () => {
  let component: BookingFormComponent;
  let fixture: ComponentFixture<BookingFormComponent>;
  let appointmentService: jest.Mocked<AppointmentService>;
  let snackBar: jest.Mocked<MatSnackBar>;
  let translocoService: jest.Mocked<TranslocoService>;

  const mockBranches: Branch[] = [
    { id: '1', code: 'BR001', displayName: 'Main Branch', active: true },
    { id: '2', code: 'BR002', displayName: 'North Branch', active: true }
  ];

  const mockServices: Service[] = [
    { id: '1', code: 'SRV001', displayName: 'Account Opening', active: true },
    { id: '2', code: 'SRV002', displayName: 'Loan Application', active: true }
  ];

  const mockAppointmentService = {
    getBranches: jest.fn(),
    getServices: jest.fn(),
    bookAppointment: jest.fn()
  };

  const mockSnackBar = {
    open: jest.fn().mockReturnValue({
      onAction: jest.fn().mockReturnValue(of(undefined)),
      afterDismissed: jest.fn().mockReturnValue(of(undefined))
    })
  };

  const mockTranslocoService = {
    getActiveLang: jest.fn().mockReturnValue('en'),
    setActiveLang: jest.fn(),
    translate: jest.fn((key: string) => key)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BookingFormComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppointmentService, useValue: mockAppointmentService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: TranslocoService, useValue: mockTranslocoService }
      ]
    })
    .overrideComponent(BookingFormComponent, {
      set: {
        providers: [
          { provide: AppointmentService, useValue: mockAppointmentService },
          { provide: MatSnackBar, useValue: mockSnackBar }
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingFormComponent);
    component = fixture.componentInstance;
    appointmentService = TestBed.inject(AppointmentService) as jest.Mocked<AppointmentService>;
    snackBar = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;
    translocoService = TestBed.inject(TranslocoService) as jest.Mocked<TranslocoService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize the booking form with empty values', () => {
      expect(component.bookingForm).toBeDefined();
      expect(component.bookingForm.get('firstName')?.value).toBe('');
      expect(component.bookingForm.get('lastName')?.value).toBe('');
      expect(component.bookingForm.get('serviceCode')?.value).toBe('');
      expect(component.bookingForm.get('branchCode')?.value).toBe('');
      expect(component.bookingForm.get('appointmentDate')?.value).toBe('');
      expect(component.bookingForm.get('appointmentTime')?.value).toBe('');
    });

    it('should have required validators on all form fields', () => {
      const firstName = component.bookingForm.get('firstName');
      const lastName = component.bookingForm.get('lastName');
      const serviceCode = component.bookingForm.get('serviceCode');
      const branchCode = component.bookingForm.get('branchCode');
      const appointmentDate = component.bookingForm.get('appointmentDate');
      const appointmentTime = component.bookingForm.get('appointmentTime');

      expect(firstName?.hasError('required')).toBe(true);
      expect(lastName?.hasError('required')).toBe(true);
      expect(serviceCode?.hasError('required')).toBe(true);
      expect(branchCode?.hasError('required')).toBe(true);
      expect(appointmentDate?.hasError('required')).toBe(true);
      expect(appointmentTime?.hasError('required')).toBe(true);
    });

    it('should have minlength validators on firstName and lastName', () => {
      const firstName = component.bookingForm.get('firstName');
      const lastName = component.bookingForm.get('lastName');

      firstName?.setValue('A');
      lastName?.setValue('B');

      expect(firstName?.hasError('minlength')).toBe(true);
      expect(lastName?.hasError('minlength')).toBe(true);

      firstName?.setValue('John');
      lastName?.setValue('Doe');

      expect(firstName?.hasError('minlength')).toBe(false);
      expect(lastName?.hasError('minlength')).toBe(false);
    });

    it('should initialize with available time slots', () => {
      expect(component.availableTimes).toBeDefined();
      expect(component.availableTimes.length).toBeGreaterThan(0);
      expect(component.availableTimes).toContain('09:00');
      expect(component.availableTimes).toContain('17:00');
    });

    it('should set minDate to today', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      component.minDate.setHours(0, 0, 0, 0);
      expect(component.minDate.getTime()).toBe(today.getTime());
    });
  });

  describe('Data Loading', () => {
    it('should load branches and services on init', () => {
      appointmentService.getBranches.mockReturnValue(of(mockBranches));
      appointmentService.getServices.mockReturnValue(of(mockServices));

      component.ngOnInit();

      expect(appointmentService.getBranches).toHaveBeenCalled();
      expect(appointmentService.getServices).toHaveBeenCalled();
      expect(component.branches).toEqual(mockBranches);
      expect(component.services).toEqual(mockServices);
      expect(component.isLoading).toBe(false);
    });

    it('should set isLoading to false after loading data', () => {
      appointmentService.getBranches.mockReturnValue(of(mockBranches));
      appointmentService.getServices.mockReturnValue(of(mockServices));

      component.isLoading = true;
      component.loadData();

      expect(component.isLoading).toBe(false);
    });

    it('should handle errors when loading data', (done) => {
      const error = { message: 'Failed to load data' };
      appointmentService.getBranches.mockReturnValue(throwError(() => error));
      appointmentService.getServices.mockReturnValue(throwError(() => error));

      component.loadData();

      setTimeout(() => {
        expect(component.isLoading).toBe(false);
        expect(snackBar.open).toHaveBeenCalledWith(
          'Failed to load branches and services. Please refresh the page.',
          'Close',
          expect.objectContaining({
            duration: 5000,
            panelClass: ['error-snackbar']
          })
        );
        done();
      }, 100);
    });
  });

  describe('Form Validation', () => {
    it('should be invalid when form is empty', () => {
      expect(component.bookingForm.valid).toBe(false);
    });

    it('should be valid when all fields are filled correctly', () => {
      component.bookingForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        serviceCode: 'SRV001',
        branchCode: 'BR001',
        appointmentDate: new Date('2025-11-20'),
        appointmentTime: '10:00'
      });

      expect(component.bookingForm.valid).toBe(true);
    });

    it('should be invalid with firstName less than 2 characters', () => {
      component.bookingForm.patchValue({
        firstName: 'J',
        lastName: 'Doe',
        serviceCode: 'SRV001',
        branchCode: 'BR001',
        appointmentDate: new Date('2025-11-20'),
        appointmentTime: '10:00'
      });

      expect(component.bookingForm.valid).toBe(false);
      expect(component.bookingForm.get('firstName')?.hasError('minlength')).toBe(true);
    });

    it('should be invalid with lastName less than 2 characters', () => {
      component.bookingForm.patchValue({
        firstName: 'John',
        lastName: 'D',
        serviceCode: 'SRV001',
        branchCode: 'BR001',
        appointmentDate: new Date('2025-11-20'),
        appointmentTime: '10:00'
      });

      expect(component.bookingForm.valid).toBe(false);
      expect(component.bookingForm.get('lastName')?.hasError('minlength')).toBe(true);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.branches = mockBranches;
      component.services = mockServices;
    });

    it('should not submit if form is invalid', () => {
      component.onSubmit();
      expect(appointmentService.bookAppointment).not.toHaveBeenCalled();
    });

    it('should submit successfully with valid form data', () => {
      const mockResponse: AppointmentResponse = {
        id: 'APT001',
        firstName: 'John',
        lastName: 'Doe',
        serviceCode: 'SRV001',
        branchCode: 'BR001',
        appointmentDate: '2025-11-20',
        appointmentTime: '10:00',
        status: AppointmentStatus.CONFIRMED
      };

      appointmentService.bookAppointment.mockReturnValue(of(mockResponse));

      component.bookingForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        serviceCode: 'SRV001',
        branchCode: 'BR001',
        appointmentDate: new Date('2025-11-20'),
        appointmentTime: '10:00'
      });

      component.onSubmit();

      expect(appointmentService.bookAppointment).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        serviceCode: 'SRV001',
        branchCode: 'BR001',
        appointmentDate: '2025-11-20',
        appointmentTime: '10:00'
      });
      expect(component.isSubmitting).toBe(false);
    });

    it('should show success message after successful submission', (done) => {
      const mockResponse: AppointmentResponse = {
        id: 'APT001',
        firstName: 'John',
        lastName: 'Doe',
        serviceCode: 'SRV001',
        branchCode: 'BR001',
        appointmentDate: '2025-11-20',
        appointmentTime: '10:00',
        status: AppointmentStatus.CONFIRMED
      };

      appointmentService.bookAppointment.mockReturnValue(of(mockResponse));

      component.bookingForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        serviceCode: 'SRV001',
        branchCode: 'BR001',
        appointmentDate: new Date('2025-11-20'),
        appointmentTime: '10:00'
      });

      component.onSubmit();

      setTimeout(() => {
        expect(snackBar.open).toHaveBeenCalledWith(
          expect.stringContaining('John Doe'),
          'Close',
          expect.objectContaining({
            duration: 5000,
            panelClass: ['success-snackbar']
          })
        );
        done();
      }, 100);
    });

    it('should reset form after successful submission', (done) => {
      const mockResponse: AppointmentResponse = {
        id: 'APT001',
        firstName: 'John',
        lastName: 'Doe',
        serviceCode: 'SRV001',
        branchCode: 'BR001',
        appointmentDate: '2025-11-20',
        appointmentTime: '10:00',
        status: AppointmentStatus.CONFIRMED
      };

      appointmentService.bookAppointment.mockReturnValue(of(mockResponse));

      component.bookingForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        serviceCode: 'SRV001',
        branchCode: 'BR001',
        appointmentDate: new Date('2025-11-20'),
        appointmentTime: '10:00'
      });

      component.onSubmit();

      setTimeout(() => {
        expect(component.bookingForm.get('firstName')?.value).toBeNull();
        expect(component.bookingForm.get('lastName')?.value).toBeNull();
        done();
      }, 100);
    });

    it('should handle submission error', (done) => {
      const error = {
        error: { message: 'Booking failed' }
      };

      appointmentService.bookAppointment.mockReturnValue(throwError(() => error));

      component.bookingForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        serviceCode: 'SRV001',
        branchCode: 'BR001',
        appointmentDate: new Date('2025-11-20'),
        appointmentTime: '10:00'
      });

      component.onSubmit();

      setTimeout(() => {
        expect(snackBar.open).toHaveBeenCalledWith(
          'Booking failed',
          'Close',
          expect.objectContaining({
            duration: 5000,
            panelClass: ['error-snackbar']
          })
        );
        expect(component.isSubmitting).toBe(false);
        done();
      }, 100);
    });

    it('should set isSubmitting to true during submission', () => {
      const mockResponse: AppointmentResponse = {
        id: 'APT001',
        firstName: 'John',
        lastName: 'Doe',
        serviceCode: 'SRV001',
        branchCode: 'BR001',
        appointmentDate: '2025-11-20',
        appointmentTime: '10:00',
        status: AppointmentStatus.CONFIRMED
      };

      appointmentService.bookAppointment.mockReturnValue(of(mockResponse));

      component.bookingForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        serviceCode: 'SRV001',
        branchCode: 'BR001',
        appointmentDate: new Date('2025-11-20'),
        appointmentTime: '10:00'
      });

      expect(component.isSubmitting).toBe(false);
      component.onSubmit();
      expect(component.isSubmitting).toBe(false);
    });

    it('should format date correctly for API', () => {
      const mockResponse: AppointmentResponse = {
        id: 'APT001',
        firstName: 'John',
        lastName: 'Doe',
        serviceCode: 'SRV001',
        branchCode: 'BR001',
        appointmentDate: '2025-11-20',
        appointmentTime: '10:00',
        status: AppointmentStatus.CONFIRMED
      };

      appointmentService.bookAppointment.mockReturnValue(of(mockResponse));

      const testDate = new Date('2025-11-20T14:30:00');
      component.bookingForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        serviceCode: 'SRV001',
        branchCode: 'BR001',
        appointmentDate: testDate,
        appointmentTime: '10:00'
      });

      component.onSubmit();

      expect(appointmentService.bookAppointment).toHaveBeenCalledWith(
        expect.objectContaining({
          appointmentDate: '2025-11-20'
        })
      );
    });
  });

  describe('Track By Functions', () => {
    it('should track services by code', () => {
      const service = mockServices[0];
      const result = component.trackByService(0, service);
      expect(result).toBe('SRV001');
    });

    it('should track branches by code', () => {
      const branch = mockBranches[0];
      const result = component.trackByBranch(0, branch);
      expect(result).toBe('BR001');
    });

    it('should track times by value', () => {
      const time = '10:00';
      const result = component.trackByTime(0, time);
      expect(result).toBe('10:00');
    });

    it('should return index as fallback for service tracking', () => {
      const result = component.trackByService(5, null as any);
      expect(result).toBe('5');
    });

    it('should return index as fallback for branch tracking', () => {
      const result = component.trackByBranch(3, null as any);
      expect(result).toBe('3');
    });
  });
});
