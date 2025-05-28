import { useWindowSize } from '@app/hooks/useWindowSize';
import { setWindowSize } from '@app/store/reducers/ui';
import { calculateWindowSize } from '@app/utils/helpers';
import ForgetPassword from '@modules/forgot-password/ForgotPassword';
import Login from '@modules/login/Login';
import Main from '@modules/main/Main';
import RecoverPassword from '@modules/recover-password/RecoverPassword';
import Register from '@modules/register/Register';
import { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Blank from '@pages/Blank';
import Dashboard from '@pages/Dashboard';
import SubMenu from '@pages/SubMenu';
import Profile from '@pages/profile/Profile';

import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';

import { Loading } from './components/Loading';
import VerifyOtp from './modules/verify-otp/VerifyOtp';
import { useAppDispatch, useAppSelector } from './store/store';

const { VITE_NODE_ENV } = import.meta.env;

const App = () => {
  const windowSize = useWindowSize();
  const screenSize = useAppSelector((state) => state.ui.screenSize);
  const dispatch = useAppDispatch();
  const location = useLocation();

  const [isAppLoading, setIsAppLoading] = useState(false);

  // useEffect(() => {
  //   onAuthStateChanged(
  //     firebaseAuth,
  //     (user) => {
  //       if (user) {
  //         dispatch(setCurrentUser(user));
  //       } else {
  //         dispatch(setCurrentUser(null));
  //       }
  //       setIsAppLoading(false);
  //     },
  //     (e) => {
  //       console.log(e);
  //       dispatch(setCurrentUser(null));
  //       setIsAppLoading(false);
  //     }
  //   );
  // }, []);

  useEffect(() => {
    const size = calculateWindowSize(windowSize.width);
    if (screenSize !== size) {
      dispatch(setWindowSize(size));
    }
  }, [windowSize]);

  useEffect(() => {
    if (location && location.pathname && VITE_NODE_ENV === 'production') {
      ReactGA.send({
        hitType: 'pageview',
        page: location.pathname,
      });
    }
  }, [location]);

  if (isAppLoading) {
    return <Loading />;
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/register" element={<PublicRoute />}>
          <Route path="/register" element={<Register />} />
        </Route>
         <Route path="/verify-otp" element={<PublicRoute />}>
         <Route path="/verify-otp" element={<VerifyOtp />} />
        </Route>
        
        <Route path="/forgot-password" element={<PublicRoute />}>
          <Route path="/forgot-password" element={<ForgetPassword />} />
        </Route>
        <Route path="/recover-password" element={<PublicRoute />}>
          <Route path="/recover-password" element={<RecoverPassword />} />
        </Route>
        
        {/* Public Dashboard route */}
           {/* <Route path="/" element={<Main />}>
           <Route path="/" element={<Dashboard />} />
            <Route path="/sub-menu-1" element={<SubMenu />} />
          <Route path="/sub-menu-2" element={<Blank />} />
          <Route path="/blank" element={<Blank />} />
          <Route path="/profile" element={<Profile />} />
           </Route> */}

      {/* Protected routes */}
      <Route path="/" element={<PrivateRoute />}>
        <Route path="/" element={<Main />}>
           <Route path="/" element={<Dashboard />} />
            <Route path="/sub-menu-1" element={<SubMenu />} />
          <Route path="/sub-menu-2" element={<Blank />} />
          <Route path="/blank" element={<Blank />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
      </Routes>
      <ToastContainer
        autoClose={3000}
        draggable={false}
        position="top-right"
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnHover
      />
    </>
  );
};

export default App;
