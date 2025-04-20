// Authentication & User Management Types
export type UserRole = "admin" | "user";

export interface AppUser {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  permissions: UserPermissions;
}

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

// Employee Types
export type PaymentType = "Monthly" | "Daily";
export type SponsorshipType = "YDM co" | "YDM est" | "Outside";
export type EmployeeStatus = "Active" | "Archived";

export interface Employee {
  id: string;
  fullName: string;
  employeeId: string;
  project: string;
  location: string;
  jobTitle: string;
  paymentType: PaymentType;
  rateOfPayment: number;
  sponsorship: SponsorshipType;
  status: EmployeeStatus;
}

// Attendance Types
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // ISO date string
  present: boolean;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  overtimeHours: number;
  note?: string; // Added note field
}

// Export Types
export type ExportFormat = "csv" | "pdf" | "xlsx";
export type ReportType = "daily" | "weekly" | "monthly" | "employees";

// Filter Types
export interface EmployeeFilters {
  project?: string;
  location?: string;
  paymentType?: PaymentType;
  sponsorship?: SponsorshipType;
  status?: EmployeeStatus;
}

export interface AttendanceFilters {
  date?: string;
  employeeId?: string;
  present?: boolean;
}

// Renamed from User to AppUser to avoid conflicts with Supabase User
export type User = AppUser;
