import { useState, useEffect } from "react";
import { Employee, EmployeeFilters } from "@/lib/types";
import { formatEmployee } from "./formatEmployee";
import { employeeMatchesFilters } from "./employeeFilter";
import { readEmployees } from "@/lib/googleSheets";

export const useEmployeeState = (currentAttendanceDate?: string) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [filters, setFilters] = useState<EmployeeFilters>({ status: "All" });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dataFetched, setDataFetched] = useState<boolean>(false);

  // ✅ تحميل الموظفين من Google Sheets
  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);

    try {
      const employeesFromSheet = await readEmployees();
      const formattedEmployees = employeesFromSheet.map(formatEmployee);

      setEmployees(formattedEmployees);
      setDataFetched(true);

      console.log(`✅ Fetched ${formattedEmployees.length} employees from Google Sheets`);
      await applyFilters(formattedEmployees, filters);
    } catch (err) {
      console.error("❌ Error fetching employees:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // ✅ تطبيق الفلاتر
  const applyFilters = async (emps: Employee[], filts: EmployeeFilters) => {
    setLoading(true);
    try {
      const filterPromises = emps.map(emp =>
        employeeMatchesFilters(emp, filts, currentAttendanceDate)
          .then(passes => (passes ? emp : null))
      );

      const filterResults = await Promise.all(filterPromises);
      const filtered = filterResults.filter(emp => emp !== null) as Employee[];

      setFilteredEmployees(filtered);
      console.log(`🔍 Filtered ${filtered.length} of ${emps.length} employees`);
    } catch (err) {
      console.error("❌ Error applying filters:", err);
    } finally {
      setLoading(false);
    }
  };

  // ⚡ تشغيل الفلاتر عند تغيّر البيانات أو الفلاتر
  useEffect(() => {
    if (employees.length > 0) {
      applyFilters(employees, filters);
    }
  }, [employees, filters, currentAttendanceDate]);

  // ✅ إعادة تحميل الموظفين
  const refreshEmployees = async (): Promise<void> => {
    await fetchEmployees();
  };

  // 🚀 تحميل أولي عند تحميل الصفحة
  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    setEmployees,
    filteredEmployees,
    filters,
    setFilters,
    loading,
    setLoading,
    error,
    dataFetched,
    refreshEmployees,
  };
};
