import './App.css';
import Search from './Components/Search';
import Navbar from './Components/Navbar';
import Cards from './Components/Card';
import React, { useEffect,useContext,useState,createContext} from 'react';
import { useGoogleOneTapLogin } from '@react-oauth/google';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './Home';
import AddUser from './AddUser';

const AdminContext = createContext();
function App() {

  
  const [IsUserLoggedIn,setIsUserLoggedIn] = useState(false);
  return (

<AdminContext.Provider value={{ IsUserLoggedIn, setIsUserLoggedIn }}>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
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
export {AdminContext}
export default App;