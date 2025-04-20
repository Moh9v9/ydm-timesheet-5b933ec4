
import { User, UserRole, UserPermissions } from "@/lib/types";
import { ProfileData } from "./types";
import { Json } from "@/integrations/supabase/types";

export const createUserFromProfile = (userId: string, profile: ProfileData): User => {
  // For admin users, always return full permissions regardless of what's stored
  if (profile.role === 'admin') {
    return {
      id: userId,
      fullName: profile.full_name,
      email: profile.email,
      password: '', // We don't store passwords
      role: 'admin',
      permissions: {
        employees: {
          view: true,
          edit: true,
          delete: true
        },
        attendees: {
          view: true,
          edit: true
        },
        export: true
      }
    };
  }

  // For non-admin users, use stored permissions
  let permissionsObj: Record<string, unknown> = {};
  
  if (typeof profile.permissions === 'object' && profile.permissions !== null && !Array.isArray(profile.permissions)) {
    permissionsObj = profile.permissions as Record<string, unknown>;
  }
  
  const role: UserRole = (profile.role === 'admin' || profile.role === 'user') 
    ? profile.role 
    : 'user';
  
  return {
    id: userId,
    fullName: profile.full_name,
    email: profile.email,
    password: '',
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
