import { GoogleLogin } from '@react-oauth/google';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../App';
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';

function Navbar() {
  const { IsUserLoggedIn, setIsUserLoggedIn } = useContext(AdminContext);
  const navigate = useNavigate();

  const responseGoogle = (response) => {
    const decoded = jwtDecode(response.credential);
    try {
      if (decoded.email_verified) {
        setIsUserLoggedIn(true); // Set IsUserLoggedIn to true
        const credentials = response.credential;
        Cookies.set('credentials', credentials, { expires: 7 }); // Set the credentials in a cookie
        navigate('/update');
      } else {
        console.error('Invalid response from Google Sign-In');
      }
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
    }
  };

  return (
    <div style={{ background: '#419197', padding: '5px', textAlign: 'center' }}>
      <p style={{ color: 'white' }}>Navbar</p>
      {IsUserLoggedIn ? (
        <p>User is authenticated</p>
      ) : (
        <GoogleLogin
          onSuccess={responseGoogle}
          onError={responseGoogle}
          cookiePolicy={'single_host_origin'}
          useOneTap
        />
      )}
    </div>
  );
}

export default Navbar;
