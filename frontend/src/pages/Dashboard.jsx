import React from "react";
import { useNavigate } from "react-router-dom";

const UserSidebar = ({ playlists }) => {
  return (
    <div className="sidebar">
      <h2>Your Playlists</h2>
      <ul>
        {playlists.map((p, idx) => (
          <li key={idx}>{p}</li>
        ))}
      </ul>
      <button
        onClick={() => window.location.href = "/history"}
        className="sidebar-button"
      >
        My History
      </button>
    </div>
  );
};

const ArtistPanel = () => {
  return (
    <div className="sidebar">
      <h2>Artist Tools</h2>
      <ul>
        <li>Release Album</li>
        <li>Compose Song</li>
        <li>Manage Albums</li>
      </ul>
    </div>
  );
};

const Dashboard = ({ userData }) => {
  const navigate = useNavigate();

  if (!userData) return <p style={{ padding: "2rem" }}>Please log in first.</p>;

  const isUser = userData.accountType === "User";
  const playlists = ["Top Hits", "Chill Vibes", "Workout"];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {isUser ? <UserSidebar playlists={playlists} /> : <ArtistPanel />}
      <div style={{ flex: 1, padding: "2rem" }}>
        <h2>
          Welcome {userData.Name} ({userData.accountType})
        </h2>
        {isUser ? (
          <p>Queue and History panel will appear here...</p>
        ) : (
          <p>Use the artist tools from the left panel.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
