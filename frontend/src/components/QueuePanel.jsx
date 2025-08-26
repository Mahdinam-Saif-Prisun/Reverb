import React from "react";
import { useQueue } from "../hooks/useQueue";

const QueuePanel = ({ userId }) => {
  const { queue, playNext } = useQueue(userId);

  return (
    <div className="panel">
      <h3>Queue</h3>
      <ul>
        {queue.map((song, idx) => (
          <li key={idx}>
            {song.Title} - {song.Artist || "Unknown"}
            <button onClick={playNext} style={{marginLeft:"5px"}}>▶</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QueuePanel;
