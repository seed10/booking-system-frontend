import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoModule } from '@jsverse/transloco';
import { AppointmentService } from '../../services/appointment.service';
import {
  Branch,
  Service,
  BookAppointmentRequest
} from '../../models/appointment.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatCardModule,
    MatProgressSpinnerModule,
    TranslocoModule
  ],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {
  bookingForm: FormGroup;
  isSubmitting = false;
  isLoading = true;

  branches: Branch[] = [];
  services: Service[] = [];
  availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  minDate = new Date();

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar
  ) {
    this.bookingForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      serviceCode: ['', Validators.required],
      branchCode: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    forkJoin({
      branches: this.appointmentService.getBranches(),
      services: this.appointmentService.getServices()
    }).subscribe({
      next: (data) => {
        this.branches = data.branches;
        this.services = data.services;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(
          'Failed to load branches and services. Please refresh the page.',
          'Close',
          {
            duration: 5000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  trackByService(index: number, service: Service): string {
    return service?.code ?? index.toString();
  }

  trackByBranch(index: number, branch: Branch): string {
    return branch?.code ?? index.toString();
  }

  trackByTime(index: number, time: string): string {
    return time ?? index.toString();
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      this.isSubmitting = true;

      const formValue = this.bookingForm.value;
      const appointmentDate = new Date(formValue.appointmentDate);
      const dateString = appointmentDate.toISOString().split('T')[0];

      const request: BookAppointmentRequest = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        serviceCode: formValue.serviceCode,
        branchCode: formValue.branchCode,
        appointmentDate: dateString,
        appointmentTime: formValue.appointmentTime
      };

      this.appointmentService.bookAppointment(request).subscribe({
        next: (response) => {
          this.isSubmitting = false;

          // Find the branch and service names for the confirmation message
          const branch = this.branches.find(b => b.code === response.branchCode);
          const service = this.services.find(s => s.code === response.serviceCode);

          this.snackBar.open(
            `Appointment confirmed for ${response.firstName} ${response.lastName} on ${response.appointmentDate} at ${response.appointmentTime} at ${branch?.displayName || 'selected branch'}`,
            'Close',
            {
              duration: 5000,
              panelClass: ['success-snackbar']
            }
          );
          this.bookingForm.reset();
        },
        error: (error) => {
          this.isSubmitting = false;
          const errorMessage = error.error?.message || 'Failed to book appointment. Please try again.';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}
