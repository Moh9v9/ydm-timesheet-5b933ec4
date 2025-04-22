
import {
  Employee,
  PaymentType,
  SponsorshipType,
  EmployeeStatus,
} from "@/lib/types";
import {
  addEmployee as addToSheet,
  updateEmployee as updateInSheet,
  deleteEmployee as deleteFromSheet,
} from "@/lib/googleSheets";
import { toast } from "sonner";

export const useEmployeeOperations = (
  employees: Employee[],
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const getEmployee = (id: string) => {
    return employees.find((emp) => emp.id === id);
  };
  
  // Add getUniqueValues function
  const getUniqueValues = (field: keyof Employee) => {
    const values = employees.map(emp => emp[field]);
    return [...new Set(values)].filter(Boolean).map(String);
  };

  const addEmployee = async (
    employee: Omit<Employee, "id">
  ): Promise<Employee> => {
    setLoading(true);
    try {
      if (employee.iqamaNo && employee.iqamaNo !== 0) {
        const existingEmployee = employees.find(
          (emp) => emp.iqamaNo === employee.iqamaNo
        );
        if (existingEmployee) {
          throw new Error(
            `An employee with Iqama No ${employee.iqamaNo} already exists`
          );
        }
      }

      const newEmployee: Employee = {
        id: (employees.length + 1).toString(),
        fullName: employee.fullName,
        iqamaNo: employee.iqamaNo,
        project: employee.project,
        location: employee.location,
        jobTitle: employee.jobTitle,
        paymentType: employee.paymentType as PaymentType,
        rateOfPayment: employee.rateOfPayment,
        sponsorship: employee.sponsorship as SponsorshipType,
        status: employee.status as EmployeeStatus,
      };

      // Convert numeric properties to string for Google Sheets API
      await addToSheet({
        id: newEmployee.id,
        fullName: newEmployee.fullName,
        iqamaNo: newEmployee.iqamaNo.toString(),
        project: newEmployee.project,
        location: newEmployee.location,
        jobTitle: newEmployee.jobTitle,
        paymentType: newEmployee.paymentType,
        rateOfPayment: newEmployee.rateOfPayment.toString(),
        sponsorship: newEmployee.sponsorship,
        status: newEmployee.status,
      });
      
      setEmployees([...employees, newEmployee]);
      toast.success("Employee added successfully");
      return newEmployee;
    } catch (err) {
      console.error("Error adding employee:", err);
      toast.error("Failed to add employee");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (
    id: string,
    updatedFields: Partial<Omit<Employee, "id">>
  ): Promise<Employee> => {
    setLoading(true);
    try {
      const existing = employees.find((e) => e.id === id);
      if (!existing) throw new Error("Employee not found");

      const updated = { ...existing, ...updatedFields };

      // Convert numeric fields to strings for Google Sheets API
      const updatedForSheet: { [key: string]: string; id: string } = {
        id,
        ...Object.entries(updatedFields).reduce((acc, [key, value]) => {
          // Convert numbers to strings
          if (typeof value === 'number') {
            acc[key] = value.toString();
          } else if (value !== undefined) {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>)
      };

      await updateInSheet(updatedForSheet);

      setEmployees((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updatedFields } : e))
      );
      toast.success("Employee updated successfully");
      return updated;
    } catch (err) {
      console.error("Error updating employee:", err);
      toast.error("Failed to update employee");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id: string) => {
    setLoading(true);
    try {
      await deleteFromSheet(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      toast.success("Employee deleted");
    } catch (err) {
      console.error("Error deleting employee:", err);
      toast.error("Failed to delete employee");
    } finally {
      setLoading(false);
    }
  };

  return {
    getEmployee,
    getUniqueValues,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  };
};
