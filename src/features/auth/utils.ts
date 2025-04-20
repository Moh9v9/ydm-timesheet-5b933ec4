
import { User, UserPermissions } from "@/lib/types";
import { ProfileData } from "./types";

export const createUserFromProfile = (userId: string, profile: ProfileData): User => {
  // Safely handle permissions
  let permissionsObj: Record<string, unknown> = {};
  
  if (typeof profile.permissions === 'object' && profile.permissions !== null && !Array.isArray(profile.permissions)) {
    permissionsObj = profile.permissions;
  }
  
  return {
    id: userId,
    fullName: profile.full_name,
    email: profile.email,
    password: '', // We don't store passwords
    role: profile.role,
    permissions: {
      view: Boolean(permissionsObj.view),
      edit: Boolean(permissionsObj.edit),
      delete: Boolean(permissionsObj.delete)
    }
  };
};
