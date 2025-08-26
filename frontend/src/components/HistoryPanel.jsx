import React from "react";
import { useQueue } from "../hooks/useQueue";

const HistoryPanel = ({ userId }) => {
  const { history } = useQueue(userId);

  return (
    <div className="panel">
      <h3>History</h3>
      <ul>
        {history.map((song, idx) => (
          <li key={idx}>{song.Title} - {song.Artist || "Unknown"}</li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryPanel;
