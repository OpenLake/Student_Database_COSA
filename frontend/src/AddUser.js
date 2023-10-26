import './App.css';
import React from 'react';
import Add from './Add_User/Components/Add'; // Import the AddUserForm component
import Navbar from './Add_User/Components/Navbar';
function AddUser() {
  return (
    <div style={{ padding: "10px" }}>
      <Navbar />
      <Add/>  
    </div>
  );
}

export default AddUser;

