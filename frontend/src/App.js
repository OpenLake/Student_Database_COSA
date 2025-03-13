import "./App.css";

import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Home from './Home';
import AddUser from "./AddUser";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import GoogleRegister from "./Components/Auth/GoogleRegister";
import { fetchCredentials } from "./services/auth";
import FeedbackForm from "./Components/FeedbackForm";
import EventList from "./Components/EventList";
import EventForm from "./Components/EventForm";
import { CreateTenure } from "./Components/TenureRecords";
import { ShowTenure } from "./Components/TenureRecords";
import RoomBooking from "./Components/RoomBooking";
import PresidentApproval from "./Components/PresidentApproval";
import PresidentDashboard from "./Components/PresidentDashboard";
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
        <Route path="/president-approval" element={<PresidentApproval />} />
        <Route path="/president-dashboard" element={<PresidentDashboard />} />
        <Route path="/" element={<AddUser />} />
        <Route path="/roombooking" element={<RoomBooking />} />
        <Route path="/register/google/:id" element={<GoogleRegister />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/add-event" element={<EventForm />} />
        {/* <Route path='/logout' element={<Logout/>} /> */}
        <Route path="/cosa/create" element={<CreateTenure />} />
        <Route path="/cosa/:id" element={<ShowTenure />} />
        <Route path="/cosa" element={<ShowTenure />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/president-approval" element={<PresidentApproval />} />
        <Route path="/president-dashboard" element={<PresidentDashboard />} />
        <Route path="/roombooking" element={<RoomBooking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/google/:id" element={<GoogleRegister />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/add-event" element={<EventForm />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/cosa/create" element={<CreateTenure />} />
        <Route path="/cosa/:id" element={<ShowTenure />} />
        <Route path="/cosa" element={<ShowTenure />} />
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
