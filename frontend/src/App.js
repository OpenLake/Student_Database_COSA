import './App.css';
import React, { useEffect, useState, createContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import AddUser from './AddUser';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

const AdminContext = createContext();

function App() {
  const [IsUserLoggedIn, setIsUserLoggedIn] = useState(() => {
    // Initialize the user's login status from localStorage
    const storedStatus = localStorage.getItem('IsUserLoggedIn');
    return storedStatus ? JSON.parse(storedStatus) : false;
  });

  useEffect(() => {
    // Load credentials from cookies
    const credentials = Cookies.get('credentials');

    if (credentials) {
      // Check if the credentials are valid (e.g., email_verified)
      const decoded = jwtDecode(credentials);
      if (decoded.email_verified) {
        setIsUserLoggedIn(true);
      }
    }
  }, []);

  useEffect(() => {
    // Update localStorage when IsUserLoggedIn changes
    localStorage.setItem('IsUserLoggedIn', JSON.stringify(IsUserLoggedIn));
  }, [IsUserLoggedIn]);

  return (
    <AdminContext.Provider value={{ IsUserLoggedIn, setIsUserLoggedIn }}>
      <BrowserRouter>
        <Routes>
          <Route
          path="/"
          element={
            IsUserLoggedIn ? (
              <Navigate to="/update" replace />
            ) : (
              <Home/>
            )
          } />
          <Route
            path="/update"
            element={
              IsUserLoggedIn ? (
                <AddUser />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </AdminContext.Provider>
  );
}

export { AdminContext };
export default App;
