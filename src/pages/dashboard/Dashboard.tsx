
import { useState, useEffect } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { BarChart3, User, UserCheck, UserX } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { filteredEmployees } = useEmployees();
  const { attendanceRecords } = useAttendance();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    presentToday: 0,
    absentToday: 0,
  });
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Calculate dashboard statistics
    const activeEmployees = filteredEmployees.filter(
      (employee) => employee.status === "Active"
    ).length;

    // Get today's attendance records
    const todayRecords = attendanceRecords.filter(
      (record) => record.date === today
    );
    const presentToday = todayRecords.filter((record) => record.present).length;
    const absentToday = todayRecords.filter((record) => !record.present).length;

    setStats({
      totalEmployees: filteredEmployees.length,
      activeEmployees,
      presentToday,
      absentToday,
    });
  }, [filteredEmployees, attendanceRecords, today]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.fullName}
          </p>
        </div>
        <div className="mt-2 md:mt-0 text-sm font-medium text-muted-foreground">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Employees Card */}
        <div className="bg-card shadow-sm rounded-lg p-6 border">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-muted-foreground">
                Total Employees
              </div>
              <div className="mt-1 text-2xl font-semibold">
                {stats.totalEmployees}
              </div>
            </div>
          </div>
        </div>

        {/* Active Employees Card */}
        <div className="bg-card shadow-sm rounded-lg p-6 border">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
              <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-muted-foreground">
                Active Employees
              </div>
              <div className="mt-1 text-2xl font-semibold">
                {stats.activeEmployees}
              </div>
            </div>
          </div>
        </div>

        {/* Present Today Card */}
        <div className="bg-card shadow-sm rounded-lg p-6 border">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
              <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-muted-foreground">
                Present Today
              </div>
              <div className="mt-1 text-2xl font-semibold">
                {stats.presentToday}
              </div>
            </div>
          </div>
        </div>

        {/* Absent Today Card */}
        <div className="bg-card shadow-sm rounded-lg p-6 border">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900">
              <UserX className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-muted-foreground">
                Absent Today
              </div>
              <div className="mt-1 text-2xl font-semibold">
                {stats.absentToday}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Section */}
      <div className="bg-card shadow-sm rounded-lg p-6 border">
        <h2 className="text-lg font-medium mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/attendance"
            className="p-4 border rounded-md bg-accent hover:bg-accent/90 transition-colors flex items-center"
          >
            <UserCheck className="h-5 w-5 mr-3" />
            <span>Record Today's Attendance</span>
          </a>
          
          <a
            href="/employees"
            className="p-4 border rounded-md bg-accent hover:bg-accent/90 transition-colors flex items-center"
          >
            <User className="h-5 w-5 mr-3" />
            <span>Manage Employees</span>
          </a>
          
          <a
            href="/reports"
            className="p-4 border rounded-md bg-accent hover:bg-accent/90 transition-colors flex items-center"
          >
            <BarChart3 className="h-5 w-5 mr-3" />
            <span>View Reports</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card shadow-sm rounded-lg p-6 border">
          <h2 className="text-lg font-medium mb-4">Recent Employees</h2>
          {filteredEmployees.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-medium">Name</th>
                    <th className="py-2 text-left font-medium">ID</th>
                    <th className="py-2 text-left font-medium">Project</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.slice(0, 5).map((employee) => (
                    <tr key={employee.id} className="border-b hover:bg-muted/50">
                      <td className="py-2">{employee.fullName}</td>
                      <td className="py-2">{employee.employeeId}</td>
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

        <div className="bg-card shadow-sm rounded-lg p-6 border">
          <h2 className="text-lg font-medium mb-4">Today's Attendance Summary</h2>
          <div className="flex items-center justify-center h-32">
            {/* Simple attendance chart */}
            <div className="flex items-end space-x-4">
              <div className="flex flex-col items-center">
                <div className="relative w-20">
                  <div
                    className="bg-green-500 rounded-t-md w-full"
                    style={{
                      height: `${Math.max(
                        20,
                        (stats.presentToday /
                          Math.max(stats.activeEmployees, 1)) *
                          100
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
                        (stats.absentToday /
                          Math.max(stats.activeEmployees, 1)) *
                          100
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
                <span className="font-bold">{stats.activeEmployees}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
