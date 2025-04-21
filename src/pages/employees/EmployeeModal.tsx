
import { useState } from "react";
import { X } from "lucide-react";
import { Employee, EmployeeStatus, PaymentType, SponsorshipType } from "@/lib/types";
import { EmployeeForm } from "./components/EmployeeForm";
import { EmployeeFormData, EmployeeModalProps } from "./types/employee-form";
import { useEmployees } from "@/contexts/EmployeeContext"; 
import { toast } from "sonner";

const EmployeeModal = ({ employee, onClose }: EmployeeModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addEmployee, updateEmployee } = useEmployees();

  // Initialize form data based on employee prop or defaults
  const initialData: EmployeeFormData = employee ? {
    fullName: employee.fullName,
    iqamaNo: employee.iqamaNo || 0,
    project: employee.project,
    location: employee.location,
    jobTitle: employee.jobTitle,
    paymentType: employee.paymentType,
    rateOfPayment: employee.rateOfPayment,
    sponsorship: employee.sponsorship,
    status: employee.status
  } : {
    fullName: "",
    iqamaNo: 0,
    project: "",
    location: "",
    jobTitle: "",
    paymentType: "Monthly" as PaymentType,
    rateOfPayment: 0,
    sponsorship: "YDM co" as SponsorshipType,
    status: "Active" as EmployeeStatus
  };

  const handleSubmit = async (formData: EmployeeFormData) => {
    setIsSubmitting(true);
    console.log("Submitting form data:", formData);

    try {
      if (employee) {
        // Update existing employee
        await updateEmployee(employee.id, formData);
        toast.success("Employee updated successfully");
      } else {
        // Create new employee
        await addEmployee(formData);
        toast.success("Employee added successfully");
      }
      onClose();
    } catch (error: any) {
      console.error("Error saving employee:", error);
      toast.error(error.message || "Error saving employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal with Escape key
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade">
      <div className="bg-background dark:bg-gray-900 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-background dark:bg-gray-900 z-10 px-6 py-4 border-b dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-semibold dark:text-gray-100">
            {employee ? "Edit Employee" : "Add New Employee"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <EmployeeForm
            initialData={initialData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;
