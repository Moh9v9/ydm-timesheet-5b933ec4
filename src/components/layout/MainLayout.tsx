
import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const MainLayout = ({ children, requireAuth = true }: MainLayoutProps) => {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed on mobile

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-background">
      {user && (
        <div className="flex flex-col min-h-screen">
          <TopBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <div className="flex-1 flex relative">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <main 
              className={`
                w-full min-h-0 p-4 transition-all duration-300 ease-in-out
                sm:p-5
                md:p-6
                ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}
              `}
            >
              <div className="container mx-auto max-w-7xl">
                {children}
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
