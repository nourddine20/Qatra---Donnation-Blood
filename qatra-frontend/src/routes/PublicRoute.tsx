import useAuthCheck from '@app/hooks/useAuthStatus';
import { Navigate, Outlet } from 'react-router-dom';


const PublicRoute = () => {
  const { isLoggedIn, isLoading } = useAuthCheck();

  if (isLoading) return null; // or <Spinner /> or skeleton UI
console.log('public route :'+isLoggedIn);
  return isLoggedIn ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;