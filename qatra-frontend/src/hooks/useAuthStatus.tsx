import axios from 'axios';
import { useEffect, useState } from 'react';

axios.defaults.baseURL = 'http://localhost:8000'; // Laravel backend
axios.defaults.withCredentials = true; // if using Sanctum SPA mode


const useAuthCheck = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
         const response = await axios.get('/api/check-auth-user', { withCredentials: true });

        if (response.status === 200 && response.data) {
          console.log(response.status);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isLoggedIn, isLoading };
};

export default useAuthCheck;
