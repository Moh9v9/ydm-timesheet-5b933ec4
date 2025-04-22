import { User } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { getUserByEmailAndPassword } from "@/lib/googleSheets";

export const useAuthOperations = () => {
  const login = async (email: string, password: string): Promise<User> => {
    try {
      console.log("🔐 Attempting login via Google Sheets...", email);
      const user = await getUserByEmailAndPassword(email, password);

      if (!user) {
        console.warn("❌ Invalid email or password");
        throw new Error("Invalid email or password");
      }

      const { id, fullName, role } = user;

      const permissions =
        role === "admin"
          ? {
              employees: { view: true, edit: true, delete: true },
              attendees: { view: true, edit: true },
              export: true,
            }
          : {
              employees: { view: true, edit: false, delete: false },
              attendees: { view: true, edit: true },
              export: false,
            };

      const userData: User = {
        id: id || uuidv4(),
        fullName: fullName || "",
        email,
        password: "",
        role: role || "user",
        permissions,
      };

      console.log("✅ Login successful:", userData);
      return userData;
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Failed to login");
    }
  };

  const logout = async () => {
    console.log("🔓 Logging out...");
    window.location.href = "/login";
  };

  return { login, logout };
};