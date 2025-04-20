
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Menu, Sun, Moon, LogOut } from "lucide-react";
import { useState } from "react";

interface TopBarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const TopBar = ({ toggleSidebar, isSidebarOpen }: TopBarProps) => {
  const { logout } = useAuth();
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
    <header className="bg-card shadow-sm z-40 relative">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md text-foreground hover:bg-accent md:hidden"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center">
            <img 
              src="https://i.ibb.co/DPfXmyDz/YDM-logo2-2.png" 
              alt="YDM Logo" 
              className="h-8 w-auto"
            />
            <span className="ml-2 text-lg font-semibold">YDM TimeSheet</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={20} className="text-foreground" />
            ) : (
              <Moon size={20} className="text-foreground" />
            )}
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-accent transition-colors"
            aria-label="Logout"
          >
            <LogOut size={20} className="text-foreground" />
          </button>
        </div>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-card rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Confirm Logout</h3>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-3">
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
