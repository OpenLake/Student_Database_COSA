import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminContext } from "../../App";
import { User } from "lucide-react";
function Navbar() {
  const { isUserLoggedIn, setIsUserLoggedIn } = useContext(AdminContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsUserLoggedIn(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2 className="navbar-title">
        <user />
        Student Portal
      </h2>
      <div className="navbar-links">
        <Link to="/profile" className="nav-link">
          <User size={20} color="white" strokeWidth={2} />
        </Link>
        <Link to="/cosa" className="nav-link">
          📚 Cosa
        </Link>
        <Link to="/feedback" className="nav-link">
          💬 Feedback
        </Link>
        <Link to="/events" className="nav-link">
          🗓️ Events
        </Link>
        <button onClick={handleLogout} className="logout-button">
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
