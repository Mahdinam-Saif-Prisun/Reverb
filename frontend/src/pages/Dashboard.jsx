import React from "react";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const dummyPlaylists = ["Top Hits", "Daily Mix 1", "Chill Vibes", "Workout"];

  return (
    <div className="sidebar">
      <h2>Your Playlists</h2>
      <ul>
        {dummyPlaylists.map((playlist, idx) => (
          <li key={idx}>{playlist}</li>
        ))}
      </ul>
    </div>
  );
};

const Dashboard = () => {
  const location = useLocation();
  const user = location.state?.user || "Guest";

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <h2>Welcome, {user}!</h2>
        <p>Your playlists are on the left.</p>
      </div>
    </div>
  );
};

export default Dashboard;
