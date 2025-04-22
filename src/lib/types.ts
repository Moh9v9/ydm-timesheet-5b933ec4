
// Modify the existing AttendanceFilters interface
export interface AttendanceFilters {
  project?: string;
  location?: string;
  paymentType?: PaymentType;
  sponsorship?: SponsorshipType;
  // Status filter removed
}
