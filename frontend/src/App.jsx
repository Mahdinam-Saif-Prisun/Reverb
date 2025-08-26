import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";


const App = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (stored) setUserData(JSON.parse(stored));
  }, []);

  return (
    <>
      <Navbar userData={userData} setUserData={setUserData} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUserData={setUserData} />} />
        <Route path="/register" element={<Register setUserData={setUserData} />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
};

export default App;
