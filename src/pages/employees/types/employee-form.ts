
import { Employee, PaymentType, SponsorshipType, EmployeeStatus } from "@/lib/types";

export interface EmployeeFormData {
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

export interface EmployeeFormProps {
  initialData: EmployeeFormData;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  isSubmitting: boolean;
}

export interface EmployeeModalProps {
  employee: Employee | null;
  onClose: () => void;
}
