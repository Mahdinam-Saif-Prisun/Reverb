import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ onHomeClick }) => {
  return (
    <nav className="navbar">
      <h1 className="logo">Reverb</h1>
      <div className="nav-links">
        <Link to="/" onClick={onHomeClick}>Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
