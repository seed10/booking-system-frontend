import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppointmentService } from './appointment.service';
import {
  AppointmentStatus,
  Branch,
  Service,
  BookAppointmentRequest,
  AppointmentResponse
} from '../models/appointment.model';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8080/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppointmentService]
    });
    service = TestBed.inject(AppointmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBranches', () => {
    it('should fetch branches from the API', () => {
      const mockBranches: Branch[] = [
        {
          id: '1',
          code: 'BR001',
          displayName: 'Main Branch',
          active: true
        },
        {
          id: '2',
          code: 'BR002',
          displayName: 'North Branch',
          active: true
        }
      ];

      service.getBranches().subscribe((branches) => {
        expect(branches).toEqual(mockBranches);
        expect(branches.length).toBe(2);
        expect(branches[0].displayName).toBe('Main Branch');
      });

      const req = httpMock.expectOne(`${baseUrl}/branches`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBranches);
    });

    it('should handle errors when fetching branches', () => {
      const errorMessage = 'Failed to load branches';

      service.getBranches().subscribe({
        next: () => fail('should have failed with an error'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/branches`);
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getServices', () => {
    it('should fetch services from the API', () => {
      const mockServices: Service[] = [
        {
          id: '1',
          code: 'SRV001',
          displayName: 'Account Opening',
          active: true
        },
        {
          id: '2',
          code: 'SRV002',
          displayName: 'Loan Application',
          active: true
        }
      ];

      service.getServices().subscribe((services) => {
        expect(services).toEqual(mockServices);
        expect(services.length).toBe(2);
        expect(services[0].displayName).toBe('Account Opening');
      });

      const req = httpMock.expectOne(`${baseUrl}/services`);
      expect(req.request.method).toBe('GET');
      req.flush(mockServices);
    });

    it('should handle errors when fetching services', () => {
      const errorMessage = 'Failed to load services';

      service.getServices().subscribe({
        next: () => fail('should have failed with an error'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/services`);
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('bookAppointment', () => {
    it('should book an appointment successfully', () => {
      const mockRequest: BookAppointmentRequest = {
        firstName: 'John',
        lastName: 'Doe',
        serviceCode: 'SRV001',
        branchCode: 'BR001',
        appointmentDate: '2025-11-20',
        appointmentTime: '10:00'
      };

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

      service.bookAppointment(mockRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(response.status).toBe(AppointmentStatus.CONFIRMED);
        expect(response.firstName).toBe('John');
      });

      const req = httpMock.expectOne(`${baseUrl}/appointments`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);
      req.flush(mockResponse);
    });

    it('should handle errors when booking an appointment', () => {
      const mockRequest: BookAppointmentRequest = {
        firstName: 'John',
        lastName: 'Doe',
        serviceCode: 'SRV001',
        branchCode: 'BR001',
        appointmentDate: '2025-11-20',
        appointmentTime: '10:00'
      };

      const errorMessage = 'Failed to book appointment';

      service.bookAppointment(mockRequest).subscribe({
        next: () => fail('should have failed with an error'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/appointments`);
      req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
    });

    it('should send correct request body with all fields', () => {
      const mockRequest: BookAppointmentRequest = {
        firstName: 'Jane',
        lastName: 'Smith',
        serviceCode: 'SRV002',
        branchCode: 'BR002',
        appointmentDate: '2025-11-25',
        appointmentTime: '14:30'
      };

      const mockResponse: AppointmentResponse = {
        id: 'APT002',
        ...mockRequest,
        status: AppointmentStatus.CONFIRMED
      };

      service.bookAppointment(mockRequest).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/appointments`);
      expect(req.request.body).toEqual(mockRequest);
      expect(req.request.body.firstName).toBe('Jane');
      expect(req.request.body.appointmentTime).toBe('14:30');
      req.flush(mockResponse);
    });
  });
});
