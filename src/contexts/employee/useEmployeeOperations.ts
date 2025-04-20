
import { Employee } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
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

  // Add new employee
  const addEmployee = async (employee: Omit<Employee, "id">): Promise<Employee> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert({
          full_name: employee.fullName,
          employee_id: employee.employeeId,
          project: employee.project,
          location: employee.location,
          job_title: employee.jobTitle,
          payment_type: employee.paymentType,
          rate_of_payment: employee.rateOfPayment,
          sponsorship: employee.sponsorship,
          status: employee.status,
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from insert');

      const newEmployee: Employee = {
        id: data.id,
        fullName: data.full_name,
        employeeId: data.employee_id,
        project: data.project,
        location: data.location,
        jobTitle: data.job_title,
        paymentType: data.payment_type,
        rateOfPayment: data.rate_of_payment,
        sponsorship: data.sponsorship,
        status: data.status,
      };

      setEmployees([...employees, newEmployee]);
      return newEmployee;
    } catch (err) {
      console.error('Error adding employee:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update employee
  const updateEmployee = async (id: string, employeeData: Partial<Employee>): Promise<Employee> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('employees')
        .update({
          full_name: employeeData.fullName,
          employee_id: employeeData.employeeId,
          project: employeeData.project,
          location: employeeData.location,
          job_title: employeeData.jobTitle,
          payment_type: employeeData.paymentType,
          rate_of_payment: employeeData.rateOfPayment,
          sponsorship: employeeData.sponsorship,
          status: employeeData.status,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from update');

      const updatedEmployee: Employee = {
        id: data.id,
        fullName: data.full_name,
        employeeId: data.employee_id,
        project: data.project,
        location: data.location,
        jobTitle: data.job_title,
        paymentType: data.payment_type,
        rateOfPayment: data.rate_of_payment,
        sponsorship: data.sponsorship,
        status: data.status,
      };

      setEmployees(employees.map(emp => emp.id === id ? updatedEmployee : emp));
      return updatedEmployee;
    } catch (err) {
      console.error('Error updating employee:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete employee
  const deleteEmployee = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEmployees(employees.filter(emp => emp.id !== id));
    } catch (err) {
      console.error('Error deleting employee:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Helper to get unique values for filter dropdowns
  const getUniqueValues = (field: keyof Employee) => {
    const values = employees.map(emp => emp[field] as string);
    return [...new Set(values)].sort();
  };

  return {
    getEmployee,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getUniqueValues,
  };
};
