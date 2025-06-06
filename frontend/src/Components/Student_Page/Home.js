import "../../App.css";
import Body from "./Body";
import Footer from "./Footer";
import Navbar from "./Navbar";
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
