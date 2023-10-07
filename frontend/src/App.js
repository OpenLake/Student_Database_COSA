import logo from './logo.svg';
import './App.css';
import Search from './Components/Search';
import Navbar from './Components/Navbar';
import Cards from './Components/Card';


function App() {
  return (
    <div style={{padding:"10px"}}>
      <Navbar />

      <br />
      <Search />
      <br />
      <br />
      <br/>
      <Cards />
      
    </div>
  );
}

export default App;
