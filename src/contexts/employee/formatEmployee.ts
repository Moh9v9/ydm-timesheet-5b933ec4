
import { Employee, PaymentType, SponsorshipType, EmployeeStatus } from "@/lib/types";

/**
 * Convert raw DB record to Employee type, including created_at passthrough.
 */
export function formatEmployee(emp: any): Employee {
  return {
    id: emp.id,
    fullName: emp.full_name,
    iqamaNo: emp.iqama_no !== null ? Number(emp.iqama_no) : 0,
    project: emp.project,
    location: emp.location,
    jobTitle: emp.job_title,
    paymentType: emp.payment_type as PaymentType,
    rateOfPayment: emp.rate_of_payment,
    sponsorship: emp.sponsorship as SponsorshipType,
    status: emp.status as EmployeeStatus,
    created_at: emp.created_at, // ISO string
  };
}
