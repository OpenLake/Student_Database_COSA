import "./App.css";

import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Home from './Home';
import GenSecDashboard from "./Components/GenSecDashboard"; //added
import GenSecEndorse from "./Components/GenSecEndorse"; //added

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
import GenSecTechPage from "./Components/GenSecTechPage";
import GensecSciTechDashboard from "./Components/GensecSciTechDashboard";
import ViewFeedback from "./Components/ViewFeedback";

import GensecAcadDashboard from "./Components/GenSecAcad";
import GenSecAcadPage from "./Components/GenSecAcadPage";
import GenSecSportsPage from "./Components/GenSecSportsPage";
import GensecSportsDashboard from "./Components/GenSecSports";
import GenSecCultPage from "./Components/GenSecCultPage";
import GensecCultDashboard from "./Components/GenSecCult";

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
        {/*added paths*/}
        <Route
          path="/gensec-cult"
          element={<GenSecDashboard role="Cultural" />}
        />
        <Route
          path="/gensec-sport"
          element={<GenSecDashboard role="Sports" />}
        />
        <Route
          path="/gensec-acad"
          element={<GenSecDashboard role="Academic" />}
        />
        <Route
          path="/gensec-tech"
          element={<GenSecDashboard role="SciTech" />}
        />
        <Route
          path="/gensec-cult-endorse"
          element={<GenSecEndorse role="Cultural" />}
        />
        <Route
          path="/gensec-sport-endorse"
          element={<GenSecEndorse role="Sports" />}
        />
        <Route
          path="/gensec-acad-endorse"
          element={<GenSecEndorse role="Academic" />}
        />
        <Route
          path="/gensec-tech-endorse"
          element={<GenSecEndorse role="Tech" />}
        />

        <Route path="/genseccult-dashboard" element={<GensecCultDashboard />} />
        <Route path="/genseccult-endorse" element={<GenSecCultPage />} />
        <Route
          path="/gensecsport-dashboard"
          element={<GensecSportsDashboard />}
        />
        <Route path="/gensecsport-endorse" element={<GenSecSportsPage />} />
        <Route path="/president-approval" element={<PresidentApproval />} />
        <Route path="/president-dashboard" element={<PresidentDashboard />} />
        <Route path="/gensectech-endorse" element={<GenSecTechPage />} />
        <Route path="/" element={<AddUser />} />
        <Route path="/gensecacad-dashboard" element={<GensecAcadDashboard />} />
        <Route path="/gensecacad-endorse" element={<GenSecAcadPage />} />
        <Route
          path="/gensectech-dashboard"
          element={<GensecSciTechDashboard />}
        />
        <Route path="/roombooking" element={<RoomBooking />} />
        <Route path="/register/google/:id" element={<GoogleRegister />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/viewfeedback" element={<ViewFeedback />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/add-event" element={<EventForm />} />
        {/* <Route path='/logout' element={<Logout/>} /> */}
        <Route path="/cosa/create" element={<CreateTenure />} />
        <Route path="/cosa/:id" element={<ShowTenure />} />
        <Route path="/cosa" element={<ShowTenure />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route
          path="/gensec-cult"
          element={<GenSecDashboard role="Cultural" />}
        />
        <Route
          path="/gensec-sport"
          element={<GenSecDashboard role="Sports" />}
        />
        <Route
          path="/gensec-acad"
          element={<GenSecDashboard role="Academic" />}
        />
        <Route
          path="/gensec-tech"
          element={<GenSecDashboard role="SciTech" />}
        />
        <Route
          path="/gensec-cult-endorse"
          element={<GenSecEndorse role="Cultural" />}
        />
        <Route
          path="/gensec-sport-endorse"
          element={<GenSecEndorse role="Sports" />}
        />
        <Route
          path="/gensec-acad-endorse"
          element={<GenSecEndorse role="Academic" />}
        />
        <Route
          path="/gensec-tech-endorse"
          element={<GenSecEndorse role="Tech" />}
        />

        <Route path="/genseccult-dashboard" element={<GensecCultDashboard />} />
        <Route path="/genseccult-endorse" element={<GenSecCultPage />} />
        <Route
          path="/gensecsport-dashboard"
          element={<GensecSportsDashboard />}
        />
        <Route path="/gensecsport-endorse" element={<GenSecSportsPage />} />
        <Route path="/gensecacad-dashboard" element={<GensecAcadDashboard />} />
        <Route path="/gensecacad-endorse" element={<GenSecAcadPage />} />
        <Route path="/viewfeedback" element={<ViewFeedback />} />

        <Route path="/president-approval" element={<PresidentApproval />} />
        <Route path="/president-dashboard" element={<PresidentDashboard />} />
        <Route path="/gensectech-endorse" element={<GenSecTechPage />} />
        <Route
          path="/gensectech-dashboard"
          element={<GensecSciTechDashboard />}
        />
        <Route path="/roombooking" element={<RoomBooking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/google/:id" element={<GoogleRegister />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/add-event" element={<EventForm />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/cosa/create" element={<CreateTenure />} />
        <Route path="/cosa/:id" element={<ShowTenure />} />
        <Route path="/cosa" element={<ShowTenure />} />
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
