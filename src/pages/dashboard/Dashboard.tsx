
// Dashboard.tsx
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  // This component now simply redirects to the Index page at root
  return <Navigate to="/" replace />;
};

export default Dashboard;
