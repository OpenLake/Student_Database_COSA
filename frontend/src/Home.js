import "./App.css";
import Body from "./Components/Body";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import React, { useState } from "react";

function Home() {
  const [studentDetails, setStudentDetails] = useState();
  return (
    <div>
      <Navbar />
      <Body studentDetails={studentDetails} />
      <Footer />
    </div>
  );
}

export default Home;
