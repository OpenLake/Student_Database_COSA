import './App.css';
import Add from './Add_User/Components/Add';
import Navbar from '../src/Components/Navbar';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import React from 'react';
import Cookies from 'js-cookie';

function AddUser() {
  const navigate = useNavigate();
  // const location = useLocation();
  const credentials = Cookies.get('credentials');
  const decoded = jwtDecode(credentials);
  console.log(decoded);
  if (!credentials || !decoded.email_verified) {
    // Redirect to login or handle unauthenticated user as needed
    // For example, you can use React Router's useHistory or useNavigate to navigate to the login page
    navigate('/');

  }

  return (
    <div>


      <Navbar />

      <Add/>


    </div>
  );
}

export default AddUser;

