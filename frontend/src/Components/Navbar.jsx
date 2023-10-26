
import { GoogleLogin } from '@react-oauth/google';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {AdminContext} from '../App'
import jwtDecode from 'jwt-decode';

function Navbar(){
  const {setIsUserLoggedIn} = useContext(AdminContext)
  
  const [user, setUser] = useState();
  const navigate = useNavigate();
  
  const responseGoogle = (response) => {


    
    setUser(response.credential);

    const decoded = jwtDecode(response.credential);
     try {

      
      if (decoded.email_verified) {
        setIsUserLoggedIn(true)
        const credentials = response.credential;
        navigate('/update', { state: { credentials } });
    //     setUser(response.credential);
    //     console.log(user);
    //     fetch('http://localhost:8000/auth', {
    //       method: 'POST',
    //       headers: {
    //         'Authorization': `Bearer ${response.credential}`, 
    //         'User-Details': JSON.stringify(decoded), 
    //       },
    //     })
        
      } else {
     
        console.error('Invalid response from Google Sign-In');
       }}
      catch (error) {
     
      console.error('Error during Google Sign-In:', error);
     }
  };
  // useEffect(() => {
    
  //   console.log(user); 
  // }, [user]);


  return (
    <div style={{ background: "#419197", padding: "5px", textAlign:"center"}}>
        {/* # want to make a div for space logo  */}
        <p style={{color: "white"}}>Navbar</p>
      {setIsUserLoggedIn ? ( // Check if the user is authenticated
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
