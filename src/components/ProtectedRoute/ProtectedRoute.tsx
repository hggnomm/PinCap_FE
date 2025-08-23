import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { decodedToken } from '../../utils/utils';
import { ROUTES } from '../../constants/routes';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const validateToken = () => {
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const decoded = decodedToken(token);
        const exp = decoded?.exp;

        if (exp && exp < Date.now() / 1000) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    validateToken();
  }, [token]);

  if (isLoading) {
    return <LoadingSpinner isLoading={true}><div /></LoadingSpinner>;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
