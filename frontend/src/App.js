import "./App.css";
import "./index.css"; // If using index.css


import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Home from './Home';
import AddUser from "./AddUser";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import GoogleRegister from "./Components/Auth/GoogleRegister";
import { fetchCredentials } from "./services/auth";
import FeedbackForm from "./Components/FeedbackForm";
//import TenureRecords from "./Components/TenureRecords";
import { CreateTenure } from "./Components/TenureRecords";
import { ShowTenure } from "./Components/TenureRecords";
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
        <Route path="/feedback" element={<FeedbackForm />} />
        {/* <Route path="/tenure" element={<TenureRecords />} /> */}
        {/* <Route path='/logout' element={<Logout/>} /> */}
        <Route path="/cosa/create" element={<CreateTenure />} />
        <Route path="/cosa" element={<ShowTenure />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/tenure" element={<TenureRecords />} /> */}
       
        <Route path="/cosa/create" element={<CreateTenure />} />
        <Route path="/cosa/:id" element={<ShowTenure />} />
        <Route path="/register/google/:id" element={<GoogleRegister />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/feedback" element={<FeedbackForm />} />
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
