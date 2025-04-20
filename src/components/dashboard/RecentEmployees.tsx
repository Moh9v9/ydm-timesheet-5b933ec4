
import { useEmployees } from "@/contexts/EmployeeContext";

export const RecentEmployees = () => {
  const { filteredEmployees } = useEmployees();

  return (
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
  );
};
