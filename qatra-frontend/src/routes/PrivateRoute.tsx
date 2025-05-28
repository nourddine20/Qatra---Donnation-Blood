import useAuthCheck from '@app/hooks/useAuthStatus';
import { Navigate, Outlet } from 'react-router-dom';


const PrivateRoute = () => {
  const { isLoggedIn, isLoading } = useAuthCheck();

  if (isLoading) return null; // or show loading spinner
console.log('private route :'+isLoggedIn);
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
