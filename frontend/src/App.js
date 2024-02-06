import "./App.css";
import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Home from './Home';
import AddUser from "./AddUser";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import GoogleRegister from "./Components/Auth/GoogleRegister";
import { fetchCredentials } from "./services/auth";

const AdminContext = createContext();

function App() {
  const [IsUserLoggedIn, setIsUserLoggedIn] = useState();
  useEffect(() => {
    fetchCredentials().then((User) => {
      if (User) {
        setIsUserLoggedIn(User);
      }
    });
  }, []);

  // Routing
  let routes;
  if (IsUserLoggedIn) {
    routes = (
      <Routes>
        <Route path="/" element={<AddUser />} />
        <Route path="/register/google/:id" element={<GoogleRegister />} />
        {/* <Route path='/logout' element={<Logout/>} /> */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/google/:id" element={<GoogleRegister />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <AdminContext.Provider value={{ IsUserLoggedIn, setIsUserLoggedIn }}>
      <BrowserRouter>{routes}</BrowserRouter>
    </AdminContext.Provider>
  );
}

export { AdminContext };
export default App;
