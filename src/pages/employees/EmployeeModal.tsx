import { useState, useEffect } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useNotification } from "@/components/ui/notification";
import { Employee, PaymentType, SponsorshipType, EmployeeStatus } from "@/lib/types";
import { X } from "lucide-react";

interface EmployeeModalProps {
  employee: Employee | null;
  onClose: () => void;
}

const EmployeeModal = ({ employee, onClose }: EmployeeModalProps) => {
  const isEditing = !!employee;
  const { addEmployee, updateEmployee } = useEmployees();
  const { success, error } = useNotification();
  
  const [formData, setFormData] = useState({
    fullName: "",
    employeeId: "",
    project: "",
    location: "",
    jobTitle: "",
    paymentType: "Monthly" as PaymentType,
    rateOfPayment: 0,
    sponsorship: "YDM co" as SponsorshipType,
    status: "Active" as EmployeeStatus,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (employee) {
      setFormData({
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "rateOfPayment") {
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
    
    // Validation
    if (!formData.fullName || !formData.employeeId || !formData.project || 
        !formData.location || !formData.jobTitle || formData.rateOfPayment <= 0) {
      error("Please fill in all required fields");
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
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border border-input rounded-md"
              required
            />
          </div>
          
          {/* Employee ID */}
          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium mb-1">
              Employee ID *
            </label>
            <input
              type="text"
              id="employeeId"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className="w-full p-2 border border-input rounded-md"
              required
            />
          </div>
          
          {/* Project */}
          <div>
            <label htmlFor="project" className="block text-sm font-medium mb-1">
              Project *
            </label>
            <input
              type="text"
              id="project"
              name="project"
              value={formData.project}
              onChange={handleChange}
              className="w-full p-2 border border-input rounded-md"
              required
            />
          </div>
          
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border border-input rounded-md"
              required
            />
          </div>
          
          {/* Job Title */}
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium mb-1">
              Job Title *
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className="w-full p-2 border border-input rounded-md"
              required
            />
          </div>
          
          {/* Payment Type */}
          <div>
            <label htmlFor="paymentType" className="block text-sm font-medium mb-1">
              Payment Type *
            </label>
            <select
              id="paymentType"
              name="paymentType"
              value={formData.paymentType}
              onChange={handleChange}
              className="w-full border border-input rounded-md p-2 bg-background dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-primary"
              required
            >
              <option value="Monthly">Monthly</option>
              <option value="Daily">Daily</option>
            </select>
          </div>
          
          {/* Rate of Payment */}
          <div>
            <label htmlFor="rateOfPayment" className="block text-sm font-medium mb-1">
              Rate of Payment *
            </label>
            <input
              type="number"
              id="rateOfPayment"
              name="rateOfPayment"
              value={formData.rateOfPayment}
              onChange={handleChange}
              className="w-full p-2 border border-input rounded-md"
              min="0"
              required
            />
          </div>
          
          {/* Sponsorship */}
          <div>
            <label htmlFor="sponsorship" className="block text-sm font-medium mb-1">
              Sponsorship *
            </label>
            <select
              id="sponsorship"
              name="sponsorship"
              value={formData.sponsorship}
              onChange={handleChange}
              className="w-full border border-input rounded-md p-2 bg-background dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-primary"
              required
            >
              <option value="YDM co">YDM co</option>
              <option value="YDM est">YDM est</option>
              <option value="Outside">Outside</option>
            </select>
          </div>
          
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-input rounded-md p-2 bg-background dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-primary"
              required
            >
              <option value="Active">Active</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-input rounded-md"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditing
                  ? "Updating..."
                  : "Adding..."
                : isEditing
                ? "Update"
                : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
