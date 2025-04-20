
import { ReactNode, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate, useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const MainLayout = ({ children, requireAuth = true }: MainLayoutProps) => {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Close sidebar by default on mobile devices
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial state
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle authentication state changes
  useEffect(() => {
    console.log("MainLayout auth check - User:", !!user, "Loading:", loading, "RequireAuth:", requireAuth);
    
    if (!loading && requireAuth && !user) {
      console.log("No user found, redirecting to login");
      navigate("/login");
    }
  }, [loading, user, requireAuth, navigate]);

  // Handle authenticated user on auth pages
  useEffect(() => {
    if (!loading && user && location.pathname === "/login") {
      console.log("User already authenticated, redirecting from login to dashboard");
      navigate("/", { replace: true });
    }
  }, [loading, user, location.pathname, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // When on a non-auth required page (like login), don't show loading spinner or redirect
  if (!requireAuth) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  // Only show loading spinner for auth-required pages
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
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
                flex-1 min-h-0 p-3 transition-all duration-300 ease-in-out overflow-x-hidden
                sm:p-4
                md:p-6
              `}
            >
              <div className="w-full max-w-full">
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
