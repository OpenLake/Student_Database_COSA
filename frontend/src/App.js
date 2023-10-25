import './App.css';
import Search from './Components/Search';
import Navbar from './Components/Navbar';
import Cards from './Components/Card';
import React, { useState, useEffect } from 'react';
import { useGoogleOneTapLogin } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useStte } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

function App() {

  const [user, setUser] = useState(null);
  
  const responseGoogle = (response) => {
 
    const decoded = jwtDecode(response.credential);
    try {
      if (decoded.email_verified) {
        
        const user = {
          sub: decoded.sub,
          name: decoded.given_name,
          email: decoded.email,
          
        };
     // Set the user data in your application's state.
        setUser(user);
        console.log(user);
        fetch('http://localhost:8000/auth', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${response.credential}`, // Include the JWT token in the Authorization header
            'User-Details': JSON.stringify(decoded), // Include user details in a custom header
          },
        })

      } else {
        // Handle unexpected response from Google Sign-In.
        console.error('Invalid response from Google Sign-In');
      }
    } catch (error) {
      // Handle any other potential errors, e.g., network issues, JSON parsing errors.
      console.error('Error during Google Sign-In:', error);
    }
  };

  

  
  return (
    <div style={{ padding: "10px" }}>
      <Navbar />
      <Search/>
      <GoogleLogin
  onSuccess={responseGoogle}
      onError={responseGoogle}
      cookiePolicy={'single_host_origin'}
  useOneTap
/>
</div>

  );
}

export default App;