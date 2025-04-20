
import { Label } from "@/components/ui/label";
import { UserRole } from "@/lib/types";

interface BasicInfoSectionProps {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  isEditMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const BasicInfoSection = ({
  fullName,
  email,
  password,
  role,
  isEditMode,
  onInputChange,
}: BasicInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name *</Label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={fullName}
          onChange={onInputChange}
          className="w-full p-2 border border-input rounded-md"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email Address *</Label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={onInputChange}
          className="w-full p-2 border border-input rounded-md"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="password">
          {isEditMode ? "Password (leave blank to keep current)" : "Password *"}
        </Label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={onInputChange}
          className="w-full p-2 border border-input rounded-md"
          required={!isEditMode}
        />
      </div>

      <div>
        <Label htmlFor="role">Role *</Label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={onInputChange}
          className="w-full p-2 border border-input rounded-md"
          required
        >
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>
    </div>
  );
};
