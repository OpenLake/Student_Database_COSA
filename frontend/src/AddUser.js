import './App.css';
import Add from './Add_User/Components/Add';
import Navbar from '../src/Components/Navbar';

import { useLocation } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import React, { useState, useEffect } from 'react';

function AddUser() {

  const location = useLocation();
  const { credentials } = location.state;
  console.log(credentials);
  return (
    <div style={{ padding: "10px" }}>

  
      <Navbar />
      <Add/>  
      
    </div>
  );
}

export default AddUser;

