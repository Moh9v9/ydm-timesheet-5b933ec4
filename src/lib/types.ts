
// Basic types used throughout the application
export type PaymentType = 'Monthly' | 'Daily';
export type SponsorshipType = 'YDM co' | 'YDM est' | 'Outside';
export type EmployeeStatus = 'Active' | 'Archived';

// Modify the existing AttendanceFilters interface
export interface AttendanceFilters {
  project?: string;
  location?: string;
  paymentType?: PaymentType;
  sponsorship?: SponsorshipType;
  date?: string;
  employeeId?: string;
  present?: boolean;
}

// Export AttendanceRecord for use in various files
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  present: boolean;
  startTime: string;
  endTime: string;
  overtimeHours: number;
  note: string;
}

// Employee interface
export interface Employee {
  id: string;
  fullName: string;
  iqamaNo: number;
  project: string;
  location: string;
  jobTitle: string;
  paymentType: PaymentType;
  rateOfPayment: number;
  sponsorship: SponsorshipType;
  status: EmployeeStatus;
  created_at?: string;
}

// EmployeeFilters interface
export interface EmployeeFilters {
  project?: string;
  location?: string;
  paymentType?: PaymentType;
  sponsorship?: SponsorshipType;
  status?: string;
}

// User-related types
export type UserRole = 'admin' | 'manager' | 'user';

export interface UserPermissions {
  employees: {
    view: boolean;
    edit: boolean;
    delete: boolean;
  };
  attendees: {
    view: boolean;
    edit: boolean;
  };
  export: boolean;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  permissions: UserPermissions;
}

// Export format type
export type ExportFormat = 'csv' | 'xlsx' | 'pdf';
