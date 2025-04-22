
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AttendanceProvider } from "@/contexts/AttendanceContext";
import { EmployeeProvider } from "@/contexts/EmployeeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Suspense } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { Routes, Route } from 'react-router-dom';
import Index from "@/pages/Index";
import Employees from "@/pages/employees/Employees";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/auth/Login";
import ForgotPassword from "@/pages/auth/ForgotPassword";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AttendanceProvider>
          <EmployeeProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<MainLayout><Index /></MainLayout>} />
                <Route path="/employees" element={<MainLayout><Employees /></MainLayout>} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
              </Routes>
            </Suspense>
          </EmployeeProvider>
        </AttendanceProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
