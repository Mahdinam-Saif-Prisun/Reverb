import React from "react";

const Sidebar = () => {
  const playlists = ["Top Hits", "Daily Mix 1", "Daily Mix 2", "Chill Vibes", "Workout"];

  return (
    <div className="w-64 bg-orange-100 h-screen p-6 space-y-6 shadow-inner">
      <h2 className="text-xl font-bold text-orange-600 mb-4">Your Playlists</h2>
      <ul className="space-y-2">
        {playlists.map((playlist, idx) => (
          <li
            key={idx}
            className="p-2 rounded cursor-pointer hover:bg-orange-200 transition"
          >
            {playlist}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
