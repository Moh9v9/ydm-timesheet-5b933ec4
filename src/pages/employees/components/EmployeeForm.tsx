
import { EmployeeFormData, EmployeeFormProps } from "../types/employee-form";
import { EmployeeFormField } from "./EmployeeFormField";

export const EmployeeForm = ({ initialData, onSubmit, isSubmitting }: EmployeeFormProps) => {
  const [formData, setFormData] = useState<EmployeeFormData>(initialData);

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
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <EmployeeFormField label="Full Name" name="fullName" required>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full p-2 border border-input rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          required
        />
      </EmployeeFormField>

      <EmployeeFormField label="Employee ID" name="employeeId">
        <input
          type="text"
          id="employeeId"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          className="w-full p-2 border border-input rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </EmployeeFormField>

      <EmployeeFormField label="Project" name="project">
        <input
          type="text"
          id="project"
          name="project"
          value={formData.project}
          onChange={handleChange}
          className="w-full p-2 border border-input rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </EmployeeFormField>

      <EmployeeFormField label="Location" name="location">
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border border-input rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </EmployeeFormField>

      <EmployeeFormField label="Job Title" name="jobTitle">
        <input
          type="text"
          id="jobTitle"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          className="w-full p-2 border border-input rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </EmployeeFormField>

      <EmployeeFormField label="Payment Type" name="paymentType">
        <select
          id="paymentType"
          name="paymentType"
          value={formData.paymentType}
          onChange={handleChange}
          className="w-full border border-input rounded-md p-2 bg-background dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-primary"
        >
          <option value="Monthly">Monthly</option>
          <option value="Daily">Daily</option>
        </select>
      </EmployeeFormField>

      <EmployeeFormField label="Rate of Payment" name="rateOfPayment">
        <input
          type="number"
          id="rateOfPayment"
          name="rateOfPayment"
          value={formData.rateOfPayment}
          onChange={handleChange}
          className="w-full p-2 border border-input rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          min="0"
        />
      </EmployeeFormField>

      <EmployeeFormField label="Sponsorship" name="sponsorship">
        <select
          id="sponsorship"
          name="sponsorship"
          value={formData.sponsorship}
          onChange={handleChange}
          className="w-full border border-input rounded-md p-2 bg-background dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-primary"
        >
          <option value="YDM co">YDM co</option>
          <option value="YDM est">YDM est</option>
          <option value="Outside">Outside</option>
        </select>
      </EmployeeFormField>

      <EmployeeFormField label="Status" name="status">
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border border-input rounded-md p-2 bg-background dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-primary"
        >
          <option value="Active">Active</option>
          <option value="Archived">Archived</option>
        </select>
      </EmployeeFormField>

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
