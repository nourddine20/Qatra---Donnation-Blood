import { } from '@app/index';
import { StyledBigUserImage, StyledSmallUserImage } from '@app/styles/common';
import {
  UserBody,
  UserFooter,
  UserHeader,
  UserMenuDropdown,
} from '@app/styles/dropdown-menus';
import axios from 'axios';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

const UserDropdown = () => {
  const navigate = useNavigate();
  const [t] = useTranslation();
   var currentUser ;
 var userauth = localStorage.getItem('user');
  if(userauth != null){
  currentUser = JSON.parse(userauth);
  }
 
  const [dropdownOpen, setDropdownOpen] = useState(false);

axios.defaults.baseURL = 'http://localhost:8000'; // Laravel backend
axios.defaults.withCredentials = true; // if using Sanctum SPA mode

const logOut = async () => {
  try {
    // Step 1: Get CSRF cookie
    await axios.get('/sanctum/csrf-cookie', { withCredentials: true });

    // Step 2: Send logout request with CSRF token header and credentials
    const response = await axios.post('/api/userlogout', {}, {
      withCredentials: true,
      headers: {
        'X-XSRF-TOKEN': decodeURIComponent(
          document.cookie
            .split('; ')
            .find(row => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1] || ''
        )
      }
    });

    console.log('Logout success:', response.data);

    // Redirect user to login page
   navigate('/login');

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Logout failed:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
};


  const navigateToProfile = (event: any) => {
    event.preventDefault();
    setDropdownOpen(false);
    navigate('/profile');
  };

  return (
    <UserMenuDropdown isOpen={dropdownOpen} hideArrow>
      <StyledSmallUserImage
        slot="head"
        src={currentUser?.photoURL}
        fallbackSrc="/img/default-profile.png"
        alt="User"
        width={25}
        height={25}
        rounded
      />
      <div slot="body">
        <UserHeader className=" bg-primary">
          <StyledBigUserImage
            src={currentUser?.photoURL}
            fallbackSrc="/img/default-profile.png"
            alt="User"
            width={90}
            height={90}
            rounded
          />
          <p>
            {currentUser?.email}
            <small>
              <span>Member since </span>
              {currentUser?.metadata?.creationTime && (
                <span>
                  {DateTime.fromRFC2822(
                    currentUser?.metadata?.creationTime
                  ).toFormat('dd LLL yyyy')}
                </span>
              )}
            </small>
          </p>
        </UserHeader>
        <UserBody>
          <div className="row">
            <div className="col-4 text-center">
              <Link to="/">{t('header.user.followers')}</Link>
            </div>
            <div className="col-4 text-center">
              <Link to="/">{t('header.user.sales')}</Link>
            </div>
            <div className="col-4 text-center">
              <Link to="/">{t('header.user.friends')}</Link>
            </div>
          </div>
        </UserBody>
        <UserFooter>
          <button
            type="button"
            className="btn btn-default btn-flat"
            onClick={navigateToProfile}
          >
            {t('header.user.profile')}
          </button>
          <button
            type="button"
            className="btn btn-default btn-flat float-right"
            onClick={logOut}
          >
            {t('login.button.signOut')}
          </button>
        </UserFooter>
      </div>
    </UserMenuDropdown>
  );
};

export default UserDropdown;
