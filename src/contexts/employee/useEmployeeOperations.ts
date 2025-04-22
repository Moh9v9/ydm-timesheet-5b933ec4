import { Employee, PaymentType, SponsorshipType, EmployeeStatus } from "@/lib/types";
import { addEmployee as addToSheet } from "@/lib/googleSheets";
import { toast } from "sonner";

export const useEmployeeOperations = (
  employees: Employee[],
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Get employee by ID
  const getEmployee = (id: string) => {
    return employees.find(emp => emp.id === id);
  };

  // Add new employee (Google Sheets)
  const addEmployee = async (employee: Omit<Employee, "id">): Promise<Employee> => {
    setLoading(true);
    try {
      // Check for duplicate iqamaNo
      if (employee.iqamaNo && employee.iqamaNo !== 0) {
        const existingEmployee = employees.find(emp => emp.iqamaNo === employee.iqamaNo);
        if (existingEmployee) {
          throw new Error(`An employee with Iqama No ${employee.iqamaNo} already exists`);
        }
      }

      const newEmployee: Employee = {
        id: (employees.length + 1).toString(), // أو استخدم UUID أو وقت timestamp
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

  return {
    getEmployee,
    addEmployee,
  };
};