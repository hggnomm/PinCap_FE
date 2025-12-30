import { useState } from "react";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";

// Check authentication on initial load
const checkAuth = (): boolean => {
  const token = localStorage.getItem("token");
  return !!token;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkAuth);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Show dashboard if authenticated
  return <Dashboard onLogout={handleLogout} />;
}

export default App;
