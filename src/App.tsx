
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { EmployeeProvider } from "@/contexts/EmployeeContext";
import { UsersProvider } from "@/contexts/UsersContext";

import MainLayout from "@/components/layout/MainLayout";
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import Employees from "@/pages/employees/Employees";
import Reports from "@/pages/reports/Reports";
import Settings from "@/pages/settings/Settings";
import NotFound from "./pages/NotFound";
import { TimeZoneProvider } from "@/contexts/TimeZoneContext";
import { AttendanceProvider } from "@/contexts/AttendanceContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TimeZoneProvider>
        <AuthProvider>
          <UsersProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  
                  {/* Protected Routes */}
                  <Route path="/" element={
                    <MainLayout>
                      <Index />
                    </MainLayout>
                  } />
                  
                  <Route path="/employees" element={
                    <MainLayout>
                      <EmployeeProvider>
                        <Employees />
                      </EmployeeProvider>
                    </MainLayout>
                  } />
                  
                  <Route path="/reports" element={
                    <MainLayout>
                      <AttendanceProvider>
                        <EmployeeProvider>
                          <Reports />
                        </EmployeeProvider>
                      </AttendanceProvider>
                    </MainLayout>
                  } />

                  <Route path="/settings" element={
                    <MainLayout>
                      <Settings />
                    </MainLayout>
                  } />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </UsersProvider>
        </AuthProvider>
      </TimeZoneProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
