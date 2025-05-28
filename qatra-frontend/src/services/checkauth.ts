// src/services/checkauth.ts
import axios from 'axios';

axios.defaults.withCredentials = true;

export const checkAuth = async () => {
  try {
    // Ensure CSRF token is set (especially for Safari users)
    await axios.get('/sanctum/csrf-cookie');
    
    // Check authenticated user
    const res = await axios.get('/api/get-auth-user');
    return { authenticated: true, user: res.data };
  } catch (err) {
    return { authenticated: false, user: null };
  }
};
