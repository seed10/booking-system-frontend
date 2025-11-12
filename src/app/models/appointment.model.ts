export enum AppointmentStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface Branch {
  id: string;
  code: string;
  displayName: string;
  active: boolean;
}

export interface Service {
  id: string;
  code: string;
  displayName: string;
  active: boolean;
}

export interface BookAppointmentRequest {
  firstName: string;
  lastName: string;
  serviceCode: string;
  branchCode: string;
  appointmentDate: string;
  appointmentTime: string;
}

export interface AppointmentResponse {
  id: string;
  firstName: string;
  lastName: string;
  serviceCode: string;
  branchCode: string;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
}

export interface ErrorResponse {
  message: string;
  status: number;
  timestamp: string;
}
