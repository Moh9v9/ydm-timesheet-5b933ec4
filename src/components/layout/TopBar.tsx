
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Menu, Sun, Moon, LogOut } from "lucide-react";
import { useState } from "react";

interface TopBarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

// Modern UserInfoCard to highlight user in top bar
const UserInfoCard = ({ fullName, role }: { fullName: string; role: string }) => (
  <div
    className="
      flex flex-col items-end justify-center
      px-4 py-2
      rounded-xl
      shadow
      bg-white/60 dark:bg-gray-900/50
      backdrop-blur-md
      border border-border
      min-w-[110px]
      max-w-[210px]
      mr-2
      transition
      animate-fade-in
    "
    style={{
      background: "linear-gradient(90deg, rgba(245,245,255,0.7) 0%, rgba(200,218,255,0.45) 100%)",
      boxShadow: "0 2px 15px 0 rgba(30, 34, 90, 0.08)",
    }}
  >
    <span className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white truncate max-w-[180px]">
      {fullName}
    </span>
    <span className="text-[11px] sm:text-xs text-gray-700 dark:text-gray-200/[0.75] font-medium mt-[1px] truncate max-w-[180px] tracking-wide uppercase">
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  </div>
);

const TopBar = ({ toggleSidebar, isSidebarOpen }: TopBarProps) => {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <header
      className="
        sticky top-0 z-30
        bg-card/80 dark:bg-card/70
        border-b border-border
        backdrop-blur-lg
        animate-fade-in
        transition
      "
    >
      <div className="flex items-center justify-between px-3 h-14">
        {/* Left: menu and logo */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center">
            <img
              src="https://i.ibb.co/DPfXmyDz/YDM-logo2-2.png"
              alt="YDM Logo"
              className="h-8 w-auto"
              draggable={false}
            />
            <span className="text-lg font-semibold hidden sm:inline ml-2 text-primary">YDM TimeSheet</span>
          </div>
        </div>

        {/* Right: User info & actions */}
        <div className="flex items-center gap-1">
          {user && (
            <UserInfoCard fullName={user.fullName} role={user.role} />
          )}

          {/* Divider before icons for clarity */}
          <div className="h-7 mx-2 w-[1.5px] bg-border/80 dark:bg-white/10 rounded-lg hidden sm:block" />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="
              p-2
              rounded-full
              bg-accent/60 hover:bg-accent transition-colors
              text-accent-foreground
              ml-1
              focus-visible:ring-2 focus-visible:ring-primary
            "
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="
              p-2
              rounded-full
              bg-destructive/70 hover:bg-destructive
              text-destructive-foreground
              transition-colors
              ml-1
              focus-visible:ring-2 focus-visible:ring-destructive
              "
            aria-label="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-card rounded-lg shadow-lg p-6 max-w-sm w-full mx-4 animate-scale-in">
            <h3 className="text-lg font-medium mb-4">Confirm Logout</h3>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopBar;
