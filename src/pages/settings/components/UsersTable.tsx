
import { User } from "@/lib/types";
import { Edit, Trash2 } from "lucide-react";

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export const UsersTable = ({ users, onEdit, onDelete, loading }: UsersTableProps) => {
  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>
                  <span className="capitalize">{user.role}</span>
                </td>
                <td>
                  <div className="flex space-x-2">
                    {user.permissions.view && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900/50 dark:text-blue-300">
                        View
                      </span>
                    )}
                    {user.permissions.edit && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full dark:bg-green-900/50 dark:text-green-300">
                        Edit
                      </span>
                    )}
                    {user.permissions.delete && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full dark:bg-red-900/50 dark:text-red-300">
                        Delete
                      </span>
                    )}
                  </div>
                </td>
                <td className="flex items-center space-x-2">
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
