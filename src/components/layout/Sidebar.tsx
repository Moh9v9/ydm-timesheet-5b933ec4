import { NavLink, useNavigate } from "react-router-dom";
import { 
  User, 
  Users, 
  Calendar, 
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

  const handleProfileClick = () => {
    navigate("/settings");
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
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                } ${!isOpen && "md:justify-center"}`
              }
            >
              <BarChart3 size={20} className={isOpen ? "mr-3" : ""} />
              {(isOpen || window.innerWidth < 768) && <span>Dashboard</span>}
            </NavLink>

            <NavLink
              to="/employees"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                } ${!isOpen && "md:justify-center"}`
              }
            >
              <Users size={20} className={isOpen ? "mr-3" : ""} />
              {(isOpen || window.innerWidth < 768) && <span>Employees</span>}
            </NavLink>

            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                } ${!isOpen && "md:justify-center"}`
              }
            >
              <FileSpreadsheet size={20} className={isOpen ? "mr-3" : ""} />
              {(isOpen || window.innerWidth < 768) && <span>Reports</span>}
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                } ${!isOpen && "md:justify-center"}`
              }
            >
              <Settings size={20} className={isOpen ? "mr-3" : ""} />
              {(isOpen || window.innerWidth < 768) && <span>Settings</span>}
            </NavLink>
          </nav>

          {/* The profile block has been removed from here */}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
