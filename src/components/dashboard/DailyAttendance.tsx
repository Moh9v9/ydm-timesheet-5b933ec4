
import { useEmployees } from "@/contexts/EmployeeContext";
import { useStatistics } from "@/hooks/useStatistics";

export const DailyAttendance = () => {
  const { filteredEmployees } = useEmployees();
  const stats = useStatistics();

  return (
    <div className="grid gap-6 lg:grid-cols-2 w-full">
      {/* Attendance Summary */}
      <div className="bg-card shadow-sm rounded-lg p-6 border">
        <h2 className="text-lg font-medium mb-4">Today's Attendance Summary</h2>
        <div className="flex items-center justify-center h-32">
          <div className="flex items-end space-x-4">
            <div className="flex flex-col items-center">
              <div className="relative w-20">
                <div
                  className="bg-green-500 rounded-t-md w-full"
                  style={{
                    height: `${Math.max(
                      20,
                      (stats.presentToday / Math.max(stats.totalEmployees, 1)) * 100
                    )}px`,
                  }}
                ></div>
              </div>
              <span className="mt-2 text-sm">Present</span>
              <span className="font-bold">{stats.presentToday}</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-20">
                <div
                  className="bg-red-500 rounded-t-md w-full"
                  style={{
                    height: `${Math.max(
                      20,
                      (stats.absentToday / Math.max(stats.totalEmployees, 1)) * 100
                    )}px`,
                  }}
                ></div>
              </div>
              <span className="mt-2 text-sm">Absent</span>
              <span className="font-bold">{stats.absentToday}</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-20">
                <div
                  className="bg-blue-500 rounded-t-md w-full"
                  style={{ height: "100px" }}
                ></div>
              </div>
              <span className="mt-2 text-sm">Total</span>
              <span className="font-bold">{stats.totalEmployees}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Employees */}
      <div className="bg-card shadow-sm rounded-lg p-6 border">
        <h2 className="text-lg font-medium mb-4">Recent Employees</h2>
        {filteredEmployees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left font-medium">Name</th>
                  <th className="py-2 text-left font-medium">Iqama No</th>
                  <th className="py-2 text-left font-medium">Project</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.slice(0, 5).map((employee) => (
                  <tr key={employee.id} className="border-b hover:bg-muted/50">
                    <td className="py-2">{employee.fullName}</td>
                    <td className="py-2">{employee.iqamaNo || "-"}</td>
                    <td className="py-2">{employee.project}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground">No employees found.</p>
        )}
      </div>
    </div>
  );
};

