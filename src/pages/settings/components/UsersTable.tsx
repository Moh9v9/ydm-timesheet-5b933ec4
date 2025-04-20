
import { User } from "@/lib/types";
import { Edit, Trash2, Users, Calendar, FileText, Eye, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export const UsersTable = ({ users, onEdit, onDelete, loading }: UsersTableProps) => {
  const isMobile = useIsMobile();
  
  const getPermissionColor = (enabled: boolean) => {
    return enabled ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  };

  const renderDetailedPermissions = (user: User) => {
    // If user is admin, return special text
    if (user.role === 'admin') {
      return (
        <div className="text-blue-600 dark:text-blue-400 text-sm italic">
          Admin users automatically have full permissions
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-1 justify-center">
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
          { Allow: user.permissions.export }
        )}
      </div>
    );
  };

  const renderPermissionBadge = (
    icon: React.ReactNode, 
    label: string, 
    permissions: { view?: boolean; edit?: boolean; delete?: boolean; Allow?: boolean }
  ) => (
    <div className="flex flex-col items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary" className={`flex items-center gap-1 mb-1 ${getPermissionColor(permissions.view !== undefined ? permissions.view : permissions.Allow || false)}`}>
              {icon}
              <span className="hidden sm:inline">{label}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{(permissions.view !== undefined ? permissions.view : permissions.Allow) ? "Has access to" : "No access to"} {label.toLowerCase()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <div className="w-full overflow-auto">
        <div className={isMobile ? "min-w-[800px]" : ""}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Permissions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"} className="capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {renderDetailedPermissions(user)}
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    {loading ? "Loading..." : "No users found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

