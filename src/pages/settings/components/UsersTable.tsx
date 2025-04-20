
import { User } from "@/lib/types";
import { Edit, Trash2, Users, Calendar, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export const UsersTable = ({ users, onEdit, onDelete, loading }: UsersTableProps) => {
  const getPermissionColor = (enabled: boolean) => {
    return enabled ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  };

  const renderPermissionBadge = (icon: React.ReactNode, label: string, enabled: boolean) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="secondary" className={`flex items-center gap-1 ${getPermissionColor(enabled)}`}>
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{enabled ? "Has access to" : "No access to"} {label.toLowerCase()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="rounded-md border bg-card">
      <table className="w-full">
        <thead>
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
            <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
            <th className="h-12 px-4 text-left align-middle font-medium">Role</th>
            <th className="h-12 px-4 text-left align-middle font-medium">Permissions</th>
            <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td className="p-4">{user.fullName}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <Badge variant={user.role === "admin" ? "default" : "secondary"} className="capitalize">
                    {user.role}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {renderPermissionBadge(
                      <Users size={14} />,
                      "Employees",
                      user.permissions.employees.view
                    )}
                    {renderPermissionBadge(
                      <Calendar size={14} />,
                      "Attendees",
                      user.permissions.attendees.view
                    )}
                    {renderPermissionBadge(
                      <FileText size={14} />,
                      "Export",
                      user.permissions.export
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4">
                {loading ? "Loading..." : "No users found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
