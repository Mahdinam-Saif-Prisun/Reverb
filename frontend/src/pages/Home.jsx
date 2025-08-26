import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-4">
      <h2 className="text-3xl font-bold text-orange-600">Welcome to Music Streaming Service</h2>
      <p className="text-gray-700">Login or Register to start listening to music.</p>
      <div className="space-x-4">
        <button
          className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-500 transition"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="bg-white text-orange-500 border border-orange-500 px-4 py-2 rounded hover:bg-orange-50 transition"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Home;
