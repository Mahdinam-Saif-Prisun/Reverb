import React from "react";

const Sidebar = ({ accountType }) => {
  const userLinks = ["Home", "Playlists", "Queue", "History"];
  const artistLinks = ["Home", "Release Album", "Compose Song", "My Albums"];

  const links = accountType === "user" ? userLinks : artistLinks;

  return (
    <div className="sidebar">
      <h2>{accountType === "user" ? "User Menu" : "Artist Menu"}</h2>
      <ul>
        {links.map((link, idx) => (
          <li key={idx}>{link}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
