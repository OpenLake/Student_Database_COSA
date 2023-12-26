import './App.css';
import Search from './Components/Search';
import Navbar from './Components/Navbar';
import React from 'react';

function Home() {


    return (
        <div style={{ padding: "10px" }}>
      <Navbar />
      <Search/>
      </div>

);
    }

    export default Home;