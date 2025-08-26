import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    if (window.confirm("Do you want to log out?")) {
      navigate("/");
    }
  };

  return (
    <div className="app">
      <Navbar onHomeClick={handleHomeClick} />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
