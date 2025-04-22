
import { useEffect, useState } from "react";
import { Employee } from "@/lib/types";
import { useEmployees } from "@/contexts/EmployeeContext";

export const useAttendanceEmployees = (currentDate: string) => {
  const { employees, loading } = useEmployees();
  const [attendanceEmployees, setAttendanceEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    let filtered = [...employees];
    setAttendanceEmployees(filtered);
  }, [employees, currentDate]);

  return {
    attendanceEmployees,
    loading
  };
};
