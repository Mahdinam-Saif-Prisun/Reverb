import React from "react";
import { useLocation, Link } from "react-router-dom";

const UserSidebar = ({ playlists }) => (
  <div className="sidebar">
    <h2>Your Playlists</h2>
    <ul>
      {playlists.map((p, idx) => (
        <li key={idx}>{p}</li>
      ))}
    </ul>
    <Link to="/history">My History</Link>
  </div>
);

const ArtistPanel = () => (
  <div className="sidebar">
    <h2>Artist Tools</h2>
    <ul>
      <li>Release Album</li>
      <li>Compose Song</li>
      <li>Manage Albums</li>
    </ul>
  </div>
);

const Dashboard = () => {
  const location = useLocation();
  let { accountType, userData } = location.state || {};

  const stored = localStorage.getItem("userData");
  if (!userData && stored) {
    const parsed = JSON.parse(stored);
    accountType = parsed.accountType;
    userData = parsed;
  }

  if (!userData)
    return <p style={{ padding: "2rem" }}>No user data. Login first.</p>;

  const isUser = accountType === "User";
  const playlists = ["Top Hits", "Chill Vibes", "Workout"];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {isUser ? <UserSidebar playlists={playlists} /> : <ArtistPanel />}
      <div style={{ flex: 1, padding: "2rem" }}>
        <h2>
          Welcome {userData.Name} ({accountType})
        </h2>
        {isUser ? (
          <p>
            Access your queue and <Link to="/history">listening history</Link>{" "}
            here.
          </p>
        ) : (
          <p>Use the artist tools from the left panel.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
