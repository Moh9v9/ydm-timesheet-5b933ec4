
import { User } from "@/lib/types";
import { Edit, Trash2, Users, Calendar, FileText, Eye, Pencil } from "lucide-react";
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

  const renderDetailedPermissions = (permissions: { view?: boolean; edit?: boolean; delete?: boolean }) => {
    return (
      <div className="flex gap-1 mt-1 justify-center">
        {permissions.view !== undefined && (
          <Badge variant="secondary" className={`text-[10px] px-1.5 py-0.5 ${getPermissionColor(permissions.view)}`}>
            <Eye size={10} className="mr-0.5" />
            view
          </Badge>
        )}
        {permissions.edit !== undefined && (
          <Badge variant="secondary" className={`text-[10px] px-1.5 py-0.5 ${getPermissionColor(permissions.edit)}`}>
            <Pencil size={10} className="mr-0.5" />
            edit
          </Badge>
        )}
        {permissions.delete !== undefined && (
          <Badge variant="secondary" className={`text-[10px] px-1.5 py-0.5 ${getPermissionColor(permissions.delete)}`}>
            <Trash2 size={10} className="mr-0.5" />
            delete
          </Badge>
        )}
      </div>
    );
  };

  const renderPermissionBadge = (
    icon: React.ReactNode, 
    label: string, 
    permissions: { view: boolean; edit?: boolean; delete?: boolean }
  ) => (
    <div className="flex flex-col items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary" className={`flex items-center gap-1 mb-1 ${getPermissionColor(permissions.view)}`}>
              {icon}
              <span className="hidden sm:inline">{label}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{permissions.view ? "Has access to" : "No access to"} {label.toLowerCase()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {renderDetailedPermissions(permissions)}
    </div>
  );

  return (
    <div className="rounded-md border bg-card">
      <table className="w-full">
        <thead>
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
            <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
            <th className="h-12 px-4 text-left align-middle font-medium">Role</th>
            <th className="h-12 px-4 text-center align-middle font-medium">Permissions</th>
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
                <td className="p-4 text-center">
                  <div className="flex flex-wrap gap-4 justify-center">
                    {renderPermissionBadge(
                      <Users size={14} />,
                      "Employees",
                      user.permissions.employees
                    )}
                    {renderPermissionBadge(
                      <Calendar size={14} />,
                      "Attendees",
                      user.permissions.attendees
                    )}
                    {renderPermissionBadge(
                      <FileText size={14} />,
                      "Export",
                      { view: user.permissions.export }
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
