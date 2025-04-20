
import { useState, useEffect } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useNotification } from "@/components/ui/notification";
import { X } from "lucide-react";
import { EmployeeModalProps, EmployeeFormData } from "./types/employee-form";
import { EmployeeForm } from "./components/EmployeeForm";

const EmployeeModal = ({ employee, onClose }: EmployeeModalProps) => {
  const isEditing = !!employee;
  const { addEmployee, updateEmployee } = useEmployees();
  const { success, error } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [initialFormData, setInitialFormData] = useState<EmployeeFormData>({
    fullName: "",
    employeeId: "",
    project: "",
    location: "",
    jobTitle: "",
    paymentType: "Monthly",
    rateOfPayment: 0,
    sponsorship: "YDM co",
    status: "Active"
  });
  
  useEffect(() => {
    if (employee) {
      setInitialFormData({
        fullName: employee.fullName,
        employeeId: employee.employeeId,
        project: employee.project,
        location: employee.location,
        jobTitle: employee.jobTitle,
        paymentType: employee.paymentType,
        rateOfPayment: employee.rateOfPayment,
        sponsorship: employee.sponsorship,
        status: employee.status,
      });
    }
  }, [employee]);

  const handleSubmit = async (formData: EmployeeFormData) => {
    if (!formData.fullName) {
      error("Please fill in the full name");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditing && employee) {
        await updateEmployee(employee.id, formData);
        success("Employee updated successfully");
      } else {
        await addEmployee(formData);
        success("Employee added successfully");
      }
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Operation failed";
      error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-card rounded-lg shadow-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {isEditing ? "Edit Employee" : "Add Employee"}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-accent"
          >
            <X size={20} />
          </button>
        </div>
        
        <EmployeeForm
          initialData={initialFormData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default EmployeeModal;
