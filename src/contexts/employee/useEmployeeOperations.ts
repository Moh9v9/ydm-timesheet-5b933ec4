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

      await addToSheet(newEmployee);
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
  ) => {
    setLoading(true);
    try {
      const existing = employees.find((e) => e.id === id);
      if (!existing) throw new Error("Employee not found");

      const updated = { ...existing, ...updatedFields };

      await updateInSheet({ id, ...updatedFields });

      setEmployees((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updatedFields } : e))
      );
      toast.success("Employee updated successfully");
    } catch (err) {
      console.error("Error updating employee:", err);
      toast.error("Failed to update employee");
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
    addEmployee,
    updateEmployee,
    deleteEmployee,
  };
};
