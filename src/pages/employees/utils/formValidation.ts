
import { EmployeeFormData } from "../types/employee-form";

export const validateEmployeeForm = (formData: EmployeeFormData): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (!formData.fullName.trim()) {
    errors.fullName = "Full name is required";
  }

  if (formData.iqamaNo && (isNaN(formData.iqamaNo) || formData.iqamaNo <= 0)) {
    errors.iqamaNo = "Iqama No must be a positive number";
  }
  
  return errors;
};
