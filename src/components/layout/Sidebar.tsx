
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  User, 
  Users, 
  Calendar, 
  Settings, 
  ChevronLeft,
  BarChart3
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-sidebar shadow-lg z-30 transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-0 md:w-16"
      } overflow-hidden`}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-end p-4 md:hidden">
          <button onClick={toggleSidebar} className="text-sidebar-foreground">
            <ChevronLeft size={20} />
          </button>
        </div>

        <div className="hidden md:flex items-center justify-center p-4">
          <button 
            onClick={toggleSidebar} 
            className="rounded-full p-1 hover:bg-sidebar-accent transition-colors"
          >
            <ChevronLeft size={20} className={`text-sidebar-foreground transform transition-transform ${!isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              } ${!isOpen && "justify-center"}`
            }
          >
            <BarChart3 size={20} className={isOpen ? "mr-3" : ""} />
            {isOpen && <span>Dashboard</span>}
          </NavLink>

          <NavLink
            to="/employees"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              } ${!isOpen && "justify-center"}`
            }
          >
            <Users size={20} className={isOpen ? "mr-3" : ""} />
            {isOpen && <span>Employees</span>}
          </NavLink>

          <NavLink
            to="/attendance"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              } ${!isOpen && "justify-center"}`
            }
          >
            <Calendar size={20} className={isOpen ? "mr-3" : ""} />
            {isOpen && <span>Attendance</span>}
          </NavLink>

          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              } ${!isOpen && "justify-center"}`
            }
          >
            <BarChart3 size={20} className={isOpen ? "mr-3" : ""} />
            {isOpen && <span>Reports</span>}
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              } ${!isOpen && "justify-center"}`
            }
          >
            <Settings size={20} className={isOpen ? "mr-3" : ""} />
            {isOpen && <span>Settings</span>}
          </NavLink>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          {isOpen ? (
            <div className="flex flex-col">
              <span className="font-medium text-sidebar-foreground">
                {user?.fullName}
              </span>
              <span className="text-sm text-sidebar-foreground/70">
                {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
              </span>
            </div>
          ) : (
            <div className="flex justify-center">
              <User size={20} className="text-sidebar-foreground" />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
