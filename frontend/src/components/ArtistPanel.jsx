// src/components/ArtistPanel.jsx
import React from "react";

const ArtistPanel = ({ artist }) => {
  return (
    <div>
      <h2>Welcome, {artist.Name}</h2>
      <h3>Artist Dashboard</h3>

      <div style={{ marginTop: "1rem" }}>
        <button>Release Album</button>
        <button style={{ marginLeft: "1rem" }}>Compose Song</button>
        <button style={{ marginLeft: "1rem" }}>My Albums</button>
      </div>
    </div>
  );
};

export default ArtistPanel;
