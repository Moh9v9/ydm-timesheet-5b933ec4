
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AttendanceProvider } from "@/contexts/AttendanceContext";
import { EmployeeProvider } from "@/contexts/EmployeeContext";

const App = () => {
  return (
    <Router>
      <AttendanceProvider>
        <EmployeeProvider>
          {/* Your app content goes here */}
        </EmployeeProvider>
      </AttendanceProvider>
    </Router>
  );
};

export default App;
