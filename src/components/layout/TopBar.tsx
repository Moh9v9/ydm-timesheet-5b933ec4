
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Menu, Sun, Moon, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LanguageSelector } from "../LanguageSelector";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface TopBarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const TopBar = ({ toggleSidebar, isSidebarOpen }: TopBarProps) => {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    try {
      setShowLogoutConfirm(false);
      toast.loading("Logging out...");
      await logout();
      // After logout is complete, manually navigate to login page
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Logout failed. Please try again.");
      // Fallback redirect if there's an error
      navigate("/login", { replace: true });
    }
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-card border-b border-border">
      <div className="flex items-center justify-between px-3 h-14">
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
            />
            <span className="text-lg font-semibold hidden sm:inline ml-2">YDM TimeSheet</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {user && (
            <div className="flex flex-col text-right mr-3 min-w-[80px]">
              <span className="font-medium text-sidebar-foreground dark:text-gray-50 text-sm leading-tight truncate max-w-[140px]">
                {user.fullName}
              </span>
              <span className="text-xs text-sidebar-foreground/70 dark:text-gray-300 leading-none truncate max-w-[140px]">
                {user.role === 'admin' ? t('admin') : 
                 user.role === 'manager' ? t('manager') : t('user')}
              </span>
            </div>
          )}
          <LanguageSelector />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('logout')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('logoutConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelLogout}>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout}>{t('logout')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default TopBar;
