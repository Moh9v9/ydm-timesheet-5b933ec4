
import { useState } from "react";
import { EmployeeFormData, EmployeeFormProps } from "../types/employee-form";
import { EmployeeFormInput } from "./form/EmployeeFormInput";
import { EmployeeFormSelect } from "./form/EmployeeFormSelect";
import { validateEmployeeForm } from "../utils/formValidation";
import { toast } from "sonner";

export const EmployeeForm = ({ initialData, onSubmit, isSubmitting, onClose }: EmployeeFormProps) => {
  const [formData, setFormData] = useState<EmployeeFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (name === "rateOfPayment" || name === "iqamaNo") {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateEmployeeForm(formData);
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please correct the errors before submitting");
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (error: any) {
      if (error.message?.includes("Iqama No")) {
        setErrors({
          iqamaNo: "An employee with this Iqama No already exists"
        });
        toast.error("An employee with this Iqama No already exists");
      } else {
        toast.error(error.message || "Error saving employee");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <EmployeeFormInput
        label="Full Name"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        error={errors.fullName}
        required
      />

      <EmployeeFormInput
        label="Iqama No (Optional)"
        name="iqamaNo"
        type="number"
        value={formData.iqamaNo || ''}
        onChange={handleChange}
        error={errors.iqamaNo}
        placeholder="Leave blank if unknown"
        min="0"
      />

      <EmployeeFormInput
        label="Project"
        name="project"
        value={formData.project}
        onChange={handleChange}
      />

      <EmployeeFormInput
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleChange}
      />

      <EmployeeFormInput
        label="Job Title"
        name="jobTitle"
        value={formData.jobTitle}
        onChange={handleChange}
      />

      <EmployeeFormSelect
        label="Payment Type"
        name="paymentType"
        value={formData.paymentType}
        onChange={handleChange}
        options={[
          { value: "Monthly", label: "Monthly" },
          { value: "Daily", label: "Daily" }
        ]}
      />

      <EmployeeFormInput
        label="Rate of Payment"
        name="rateOfPayment"
        type="number"
        value={formData.rateOfPayment}
        onChange={handleChange}
        min="0"
      />

      <EmployeeFormSelect
        label="Sponsorship"
        name="sponsorship"
        value={formData.sponsorship}
        onChange={handleChange}
        options={[
          { value: "YDM co", label: "YDM co" },
          { value: "YDM est", label: "YDM est" },
          { value: "Outside", label: "Outside" }
        ]}
      />

      <EmployeeFormSelect
        label="Status"
        name="status"
        value={formData.status}
        onChange={handleChange}
        options={[
          { value: "Active", label: "Active" },
          { value: "Archived", label: "Archived" }
        ]}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-input rounded-md dark:hover:bg-gray-700"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};
