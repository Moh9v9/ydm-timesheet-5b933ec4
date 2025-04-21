
import { NavLink, useNavigate } from "react-router-dom";
import { 
  Users, 
  Settings, 
  ChevronLeft,
  BarChart3,
  FileSpreadsheet
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    // Hide sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-64 bg-sidebar
          transform transition-transform duration-300 ease-in-out
          border-r border-sidebar-border
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:z-0
          ${!isOpen && 'md:w-16'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Mobile close button */}
          <div className="flex justify-end p-4 md:hidden">
            <button 
              onClick={toggleSidebar}
              className="text-sidebar-foreground hover:bg-sidebar-accent rounded-full p-1"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          {/* Desktop toggle button */}
          <div className="hidden md:flex justify-end p-4">
            <button 
              onClick={toggleSidebar}
              className="text-sidebar-foreground hover:bg-sidebar-accent rounded-full p-1"
              aria-label="Toggle sidebar"
            >
              <ChevronLeft 
                size={20} 
                className={`transform transition-transform duration-300 ${!isOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
            {/* Navigation Links */}
            <button
              onClick={() => handleNavigate("/")}
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                window.location.pathname === "/"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              } ${!isOpen && "md:justify-center"}`}
            >
              <BarChart3 size={20} className={isOpen ? "mr-3" : ""} />
              {(isOpen || window.innerWidth < 768) && <span>Dashboard</span>}
            </button>

            <button
              onClick={() => handleNavigate("/employees")}
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                window.location.pathname === "/employees"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              } ${!isOpen && "md:justify-center"}`}
            >
              <Users size={20} className={isOpen ? "mr-3" : ""} />
              {(isOpen || window.innerWidth < 768) && <span>Employees</span>}
            </button>

            <button
              onClick={() => handleNavigate("/reports")}
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                window.location.pathname === "/reports"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              } ${!isOpen && "md:justify-center"}`}
            >
              <FileSpreadsheet size={20} className={isOpen ? "mr-3" : ""} />
              {(isOpen || window.innerWidth < 768) && <span>Reports</span>}
            </button>

            <button
              onClick={() => handleNavigate("/settings")}
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                window.location.pathname === "/settings"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              } ${!isOpen && "md:justify-center"}`}
            >
              <Settings size={20} className={isOpen ? "mr-3" : ""} />
              {(isOpen || window.innerWidth < 768) && <span>Settings</span>}
            </button>
          </nav>

          {/* The profile block has been removed from here */}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

