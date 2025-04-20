
import { User, UserRole, UserPermissions } from "@/lib/types";
import { ProfileData } from "./types";
import { Json } from "@/integrations/supabase/types";

export const createUserFromProfile = (userId: string, profile: ProfileData): User => {
  // Safely handle permissions
  let permissionsObj: Record<string, unknown> = {};
  
  // Check if permissions is an object and not null or an array
  if (typeof profile.permissions === 'object' && profile.permissions !== null && !Array.isArray(profile.permissions)) {
    permissionsObj = profile.permissions as Record<string, unknown>;
  }
  
  // Safely convert role string to UserRole type
  const role: UserRole = (profile.role === 'admin' || profile.role === 'user') 
    ? profile.role 
    : 'user';
  
  // Create the user with the updated permission structure
  return {
    id: userId,
    fullName: profile.full_name,
    email: profile.email,
    password: '', // We don't store passwords
    role: role,
    permissions: {
      employees: {
        view: Boolean(permissionsObj.employees && (permissionsObj.employees as any)?.view),
        edit: Boolean(permissionsObj.employees && (permissionsObj.employees as any)?.edit),
        delete: Boolean(permissionsObj.employees && (permissionsObj.employees as any)?.delete)
      },
      attendees: {
        view: Boolean(permissionsObj.attendees && (permissionsObj.attendees as any)?.view),
        edit: Boolean(permissionsObj.attendees && (permissionsObj.attendees as any)?.edit)
      },
      export: Boolean(permissionsObj.export)
    }
  };
};
