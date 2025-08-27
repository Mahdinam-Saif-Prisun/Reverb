import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ userData, setUserData }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Do you want to logout?")) {
      localStorage.removeItem("userData");
      setUserData(null);
      navigate("/login");
    }
  };

  return (
    <nav className="navbar">
      <h1 className="logo">Reverb</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {userData && <Link to="/dashboard">Dashboard</Link>}
        {!userData ? (
          <Link to="/login">Login</Link>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              marginLeft: "1rem",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
