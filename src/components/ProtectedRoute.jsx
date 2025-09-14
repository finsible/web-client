import { Navigate, useLocation } from 'react-router-dom';
import PageLayout from './PageLayout.jsx';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // ✅ Check if user is authenticated
  const isAuthenticated = () => {
    const authCookie = document.cookie.match("is_authenticated=true");
    return authCookie;
  };

  if (!isAuthenticated()) {
    // ✅ Redirect to login with return url
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // return the page with sidebar
  return (
    <div className="bg-background absolute inset-0">
      <PageLayout>{children}</PageLayout>
    </div>
  );
};

export default ProtectedRoute;