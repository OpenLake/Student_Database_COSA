import './App.css';
import Search from './Components/Search';
import Navbar from './Components/Navbar';
import Cards from './Components/Card';
import React, { useState } from 'react';

function App() {
  const [fetchedData, setFetchedData] = useState(null);

  // Define a function to set the fetched data

  return (
    <div style={{ padding: "10px" }}>
      <Navbar />
      <Search/>
      
    </div>
  );
}

export default App;