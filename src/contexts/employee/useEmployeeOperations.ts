
import { Employee, PaymentType, SponsorshipType, EmployeeStatus } from "@/lib/types";
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
      // Check if iqamaNo already exists (if it's provided)
      if (employee.iqamaNo && employee.iqamaNo !== 0) {
        const existingEmployee = employees.find(emp => emp.iqamaNo === employee.iqamaNo);
        if (existingEmployee) {
          throw new Error(`An employee with Iqama No ${employee.iqamaNo} already exists`);
        }
      }

      const iqamaNo = employee.iqamaNo && employee.iqamaNo !== 0
        ? employee.iqamaNo
        : null;

      const { data, error } = await supabase
        .from('employees')
        .insert({
          full_name: employee.fullName,
          iqama_no: iqamaNo,
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
        iqamaNo: data.iqama_no !== null ? Number(data.iqama_no) : 0,
        project: data.project,
        location: data.location,
        jobTitle: data.job_title,
        paymentType: data.payment_type as PaymentType,
        rateOfPayment: data.rate_of_payment,
        sponsorship: data.sponsorship as SponsorshipType,
        status: data.status as EmployeeStatus,
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
      const iqamaNo = employeeData.iqamaNo && employeeData.iqamaNo !== 0 
        ? employeeData.iqamaNo 
        : null;

      const { data, error } = await supabase
        .from('employees')
        .update({
          full_name: employeeData.fullName,
          iqama_no: iqamaNo,
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
        iqamaNo: data.iqama_no !== null ? Number(data.iqama_no) : 0,
        project: data.project,
        location: data.location,
        jobTitle: data.job_title,
        paymentType: data.payment_type as PaymentType,
        rateOfPayment: data.rate_of_payment,
        sponsorship: data.sponsorship as SponsorshipType,
        status: data.status as EmployeeStatus,
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
    const values = employees.map(emp => String(emp[field] ?? ''));
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
