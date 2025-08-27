import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// Backend endpoint
const BACKEND_URL = "http://localhost:3000";

// --- Theme ---
const bgColor = "#191c3d";
const cardBg = "#21255a";
const accent = "#6c47cd";
const accent2 = "#3ec3ff";
const accent3 = "#df7bff";
const textColor = "#e6e8ff";
const cardStyle = { background: cardBg, borderRadius: 13, margin: "1.7rem auto", padding: 24, boxShadow: '0 2px 16px #191c3d88', maxWidth: 1000, color: textColor };
const buttonStyle = {
  border: "none",
  color: textColor,
  background: accent,
  cursor: "pointer",
  padding: "0.47rem 1.3rem",
  borderRadius: 7,
  fontWeight: "bold",
  margin: "0.2rem"
};
const inputStyle = {
  background: "#272a48",
  color: textColor,
  border: "none",
  borderRadius: 7,
  padding: "0.7rem",
  marginBottom: "1rem",
  outline: "none",
  width: "100%"
};
const hrStyle = { border: "none", borderTop: "1px solid #343870", margin: "1.2rem 0" };
const activeButton = { ...buttonStyle, background: accent2, color: "#171a3d" };
const smallButton = { ...buttonStyle, padding: "0.2rem 0.6rem", fontSize: "0.9rem" };

// --- Navbar ---
function Navbar({ userData, setUserData, setView }) {
  const isUser = userData?.accountType === "User";
  const isArtist = userData?.accountType === "Artist";
  const isAdmin = userData?.Role === "admin";
  return (
    <nav style={{
      background: cardBg,
      color: textColor,
      padding: "1.3rem 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: '0 0 22px #432c7399',
      borderBottom: "2px solid " + accent
    }}>
      <div style={{ fontWeight: "bold", fontSize: 34, cursor: "pointer", letterSpacing: 0.2 }} onClick={() => setView("dashboard")}>
        <span style={{ color: accent2 }}>Reverb</span>
      </div>
      {userData &&
        <div>
          <button style={buttonStyle} onClick={() => setView("dashboard")}>Home</button>
          {isUser && <>
            <button style={buttonStyle} onClick={() => setView("songs")}>Songs</button>
            <button style={buttonStyle} onClick={() => setView("queues")}>Queues</button>
            <button style={buttonStyle} onClick={() => setView("playlists")}>Playlists</button>
            <button style={buttonStyle} onClick={() => setView("artists")}>Artists</button>
            <button style={buttonStyle} onClick={() => setView("radio")}>Radio</button>
            <button style={buttonStyle} onClick={() => setView("history")}>History</button>
          </>}
          {isArtist && <>
            <button style={buttonStyle} onClick={() => setView("release")}>Release</button>
          </>}
          {isAdmin && <>
            <button style={buttonStyle} onClick={() => setView("radioAdmin")}>Radio Admin</button>
          </>}
          <button style={{ ...buttonStyle, background: accent2 }} onClick={() => {
            localStorage.removeItem("userData");
            setUserData(null);
            setView("login");
          }}>Logout</button>
        </div>
      }
    </nav>
  );
}

// --- Auth ---
function AuthForm({ setUserData, setView }) {
  const [accountType, setAccountType] = useState("User");
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ Name: "", Email: "", Pass_hash: "" });
  const [error, setError] = useState("");
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const endpoint = `/auth/${accountType.toLowerCase()}/${isRegister ? "register" : "login"}`;
      const payload = isRegister ? { ...form } : { Email: form.Email, Pass_hash: form.Pass_hash };
      const res = await axios.post(`${BACKEND_URL}${endpoint}`, payload);
      const userObj = accountType === "User" ? res.data.user : res.data.artist;
      if (!userObj) throw new Error("Invalid response");
      const storedUser = { ...userObj, accountType, User_ID: userObj.User_ID || userObj.Artist_ID };
      localStorage.setItem("userData", JSON.stringify(storedUser));
      setUserData(storedUser); setView("dashboard");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Unknown error");
    }
  };
  return (
    <div style={{ ...cardStyle, background: '#242859', textAlign: "center", marginTop: 64, maxWidth: 430, border: "2px solid " + accent }}>
      <h2>{isRegister ? "Register" : "Login"} to <span style={{ color: accent2 }}>Reverb</span></h2>
      <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
        <select name="Type" value={accountType} onChange={e => setAccountType(e.target.value)} style={inputStyle}>
          <option>User</option>
          <option>Artist</option>
        </select>
        {isRegister && (<input name="Name" type="text" placeholder="Name" value={form.Name} onChange={handleChange} required style={inputStyle} />)}
        <input name="Email" type="email" placeholder="Email" value={form.Email} onChange={handleChange} required style={inputStyle} />
        <input name="Pass_hash" type="password" placeholder="Password" value={form.Pass_hash} onChange={handleChange} required style={inputStyle} />
        <button type="submit" style={buttonStyle}>{isRegister ? `Register` : `Login`}</button>
        {error && <div style={{ color: accent3, margin: "1rem 0 0 0" }}>{error}</div>}
      </form>
      <div style={{ marginTop: 16, textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Have an account? Login" : "No account? Register"}
      </div>
    </div>
  );
}

// --- PlayerBar ---
function PlayerBar({ currentSong, audioRef, stopPlayer }) {
  if (!currentSong) return null;

  const artistNames = currentSong?.ArtistsDisplay || "";
  const styleScrollingText = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    position: "relative",
    maxWidth: "400px",
    fontWeight: "600",
    userSelect: "none",
  };
  const styleInnerText = {
    display: "inline-block",
    paddingLeft: artistNames.length > 50 ? "100%" : "0",
    animation: artistNames.length > 50 ? "scroll-left 20s linear infinite" : "none"
  };
  return (
    <>
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .fade{
          position:absolute;
          content:"";
          width:30px;
          top:0; bottom:0;
          pointer-events:none;
          background: linear-gradient(to right, ${bgColor} 0%, transparent 100%);
        }
        .fade-right{
          right:0;
          background: linear-gradient(to left, ${bgColor} 0%, transparent 100%);
        }
        .fade-left{
          left:0;
        }
      `}</style>
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, background: "#25184a", color: "#fff", boxShadow: "0 0 22px #6c47cd44",
        display: "flex", alignItems: "center", padding: "0.9rem 2.5rem", fontSize: "1.18rem", zIndex: 99, borderTop: "2px solid " + accent
      }}>
        <div style={{ flex: 1, overflow: "hidden", position: "relative", marginRight: "2rem" }}>
          <b>{currentSong.Title}</b>
          <div style={styleScrollingText}>
            <div style={styleInnerText}>{artistNames}</div>
            {artistNames.length > 50 && (
              <>
                <div className="fade fade-left" />
                <div className="fade fade-right" />
              </>
            )}
          </div>
        </div>
        <audio ref={audioRef} src={currentSong.Url} controls autoPlay style={{ flex: 3, maxWidth: 410, background: "#222" }} onEnded={stopPlayer} />
        <button onClick={stopPlayer} style={{ ...buttonStyle, background: accent2, marginLeft: "2rem" }}>Stop</button>
      </div>
    </>
  );
}

// --- Dashboard ---
function Dashboard({ userData }) {
  return (
    <div style={{ ...cardStyle, marginTop: 56, background: "#262c51" }}>
      <h2>Welcome <span style={{ color: accent2 }}>{userData.Name}</span>!</h2>
      <hr style={hrStyle} />
      <div>Account Type: <b style={{ color: accent }}>{userData.accountType}</b></div>
      {userData.accountType === "User" && <div style={{ marginTop: 22, color: accent2 }}>Browse using the navigation above.</div>}
      {userData.accountType === "Artist" &&
        <div style={{ marginTop: 22, color: accent2 }}>
          Use the <b>Release</b> button to manage your releases, add collaborations, and publish songs.
        </div>
      }
    </div>
  );
}

// --- Songs Page ---
function SongsPage({ userData, queues, currentQueueId, setCurrentQueueId, addToQueue, playSong, likeSong, unlikeSong, likedSongIDs, rateSong, getRating }) {
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState("");
  const [collabArtists, setCollabArtists] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BACKEND_URL}/songs`);
        setSongs(res.data || []);
      } catch (err) {
        console.error("Error fetching songs:", err);
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    if (songs.length > 0) {
      songs.forEach(s => {
        axios.get(`${BACKEND_URL}/compose/song/${s.Song_ID}`)
          .then(res => {
            setCollabArtists(ca => ({ ...ca, [s.Song_ID]: res.data || [] }));
          })
          .catch(err => {
            console.error(`Error fetching artists for song ${s.Song_ID}:`, err);
            setCollabArtists(ca => ({ ...ca, [s.Song_ID]: [] }));
          });
      });
    }
  }, [songs]);

  const filtered = songs.filter(s => s.Title && s.Title.toLowerCase().includes(query.toLowerCase()));

  function artistListString(songID) {
    if (!collabArtists[songID]) return "";
    return collabArtists[songID].map(a => a.Name).join(", ");
  }

  const renderStars = (songID) => {
    const val = getRating(songID) || 0;
    return (
      <span style={{ marginLeft: 14 }}>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            style={{
              fontSize: 20,
              color: star <= val ? accent2 : "#666",
              cursor: "pointer"
            }}
            onClick={() => rateSong(songID, star)}
            aria-label={`Rate ${star} stars`}
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === "Enter") rateSong(songID, star); }}
          >★</span>
        ))}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={cardStyle}>
        <h2><span style={{ color: accent2 }}>Songs</span></h2>
        <div style={{ color: "#bbb", textAlign: "center", padding: "2rem" }}>Loading songs...</div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <h2><span style={{ color: accent2 }}>Songs</span></h2>
      <div style={{ display: 'flex', gap: 18, flexWrap: "wrap", alignItems: "center", marginBottom: 18 }}>
        <input 
          placeholder="Search song..." 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
          style={{ ...inputStyle, flex: 1, maxWidth: 350, marginBottom: 0 }} 
        />
        {queues.length > 0 && (
          <select 
            value={currentQueueId || ""} 
            onChange={e => setCurrentQueueId(Number(e.target.value))} 
            style={{ ...inputStyle, maxWidth: 260, marginBottom: 0 }} 
            aria-label="Select Queue to add song"
          >
            {queues.map(q => <option key={q.Queue_ID} value={q.Queue_ID}>{q.Incognito ? "Incognito " : ""}Q{q.Queue_ID}</option>)}
          </select>
        )}
      </div>
      
      {filtered.length === 0 ? (
        <div style={{ color: "#bbb", textAlign: "center", padding: "2rem" }}>
          {songs.length === 0 ? "No songs available." : "No songs match your search."}
        </div>
      ) : (
        <table style={{ width: "100%", color: textColor, background: "#191c35", borderRadius: 8, fontSize: 17, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#181f38", textAlign: "left" }}>
              <th style={{padding:"0.75rem 1rem"}}>Title</th>
              <th style={{padding:"0.75rem 1rem", maxWidth: 250}}>Artists</th>
              <th style={{padding:"0.75rem 1rem"}}>Duration</th>
              <th style={{padding:"0.75rem 1rem"}}>Actions</th>
              <th style={{padding:"0.75rem 1rem"}}>Likes</th>
              <th style={{padding:"0.75rem 1rem"}}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s =>
              <tr key={s.Song_ID} style={{ borderBottom: "1px solid #2a2f57" }}>
                <td style={{ fontWeight: "bold", padding: "0.8rem 1rem" }}>{s.Title}</td>
                <td style={{ padding: "0.8rem 1rem", maxWidth: 260, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={artistListString(s.Song_ID)}>
                  {artistListString(s.Song_ID) || "Unknown Artist"}
                </td>
                <td style={{ padding: "0.8rem 1rem", fontVariantNumeric: "tabular-nums" }}>{formatDuration(s.Duration)}</td>
                <td style={{ padding: "0.8rem 1rem" }}>
                  <button style={buttonStyle} onClick={() => playSong({ ...s, ArtistsDisplay: artistListString(s.Song_ID) })} aria-label={`Play ${s.Title}`}>▶ Play</button>
                  {currentQueueId && <button style={buttonStyle} onClick={() => addToQueue(s, currentQueueId)} aria-label={`Add ${s.Title} to queue`}>+ Queue</button>}
                </td>
                <td style={{ padding: "0.8rem 1rem", textAlign: "center" }}>
                  {likedSongIDs.includes(s.Song_ID) ?
                    <button style={{ ...buttonStyle, background: accent3 }} onClick={() => unlikeSong(s.Song_ID)} aria-label={`Unlike ${s.Title}`}>💜</button> :
                    <button style={buttonStyle} onClick={() => likeSong(s.Song_ID)} aria-label={`Like ${s.Title}`}>🤍</button>
                  }
                </td>
                <td style={{ padding: "0.8rem 1rem", textAlign: "center" }}>
                  {renderStars(s.Song_ID)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

// --- Queue Page ---
function QueuePage({
  userData, queues, currentQueueId, setCurrentQueueId, queueSongs,
  fetchQueues, fetchQueueSongs, playSong, removeFromQueue, sortQueue, addQueueDB, deleteQueue
}) {
  const [newQueueIncognito, setNewQueueIncognito] = useState(false);

  const handleAddQueue = async () => {
    await addQueueDB(newQueueIncognito);
    setNewQueueIncognito(false);
    fetchQueues();
  };
  const handleDeleteQueue = async (qid) => {
    await deleteQueue(qid);
    if (queues.length && currentQueueId === qid) {
      const remaining = queues.filter(q => q.Queue_ID !== qid);
      if (remaining.length > 0) setCurrentQueueId(remaining[0].Queue_ID);
    }
    fetchQueues();
  };
  const moveSong = async (idx, dir) => {
    if (queueSongs.length < 2) return;
    let toIdx = null;
    if (dir === "up" && idx > 0) toIdx = idx - 1;
    if (dir === "down" && idx < queueSongs.length - 1) toIdx = idx + 1;
    if (toIdx !== null) await sortQueue(currentQueueId, idx, toIdx);
  };

  return (
    <div style={cardStyle}>
      <h2><span style={{ color: accent2 }}>Queues</span></h2>
      <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
        <div style={{ width: 250 }}>
          <div>
            <label style={{ userSelect: "none" }}>
              <input
                type="checkbox"
                checked={newQueueIncognito}
                onChange={e => setNewQueueIncognito(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              Incognito?
            </label>
            <button style={buttonStyle} onClick={handleAddQueue}>Add Queue</button>
          </div>
          <hr style={hrStyle} />
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {queues.map(q =>
              <li
                key={q.Queue_ID}
                style={{
                  background: currentQueueId === q.Queue_ID ? accent : "#191940",
                  borderRadius: 5, margin: "5px 0", fontWeight: "bold",
                  cursor: "pointer", padding: "0.4rem 1rem",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  color: currentQueueId === q.Queue_ID ? textColor : null
                }}
                onClick={() => setCurrentQueueId(q.Queue_ID)}
              >
                <span>{q.Incognito ? "(Incognito) " : ""}Q{q.Queue_ID}</span>
                <button style={{ ...buttonStyle, background: accent2 }} onClick={(e) => {e.stopPropagation(); handleDeleteQueue(q.Queue_ID)}}>Del</button>
              </li>
            )}
          </ul>
        </div>
        <div style={{ flex: 1, marginLeft: 24 }}>
          <h3>
            {currentQueueId ? `Q${currentQueueId}` : "No Queue Selected"} {queues.find(q => q.Queue_ID === currentQueueId)?.Incognito ? "(Incognito)" : ""}
            {currentQueueId && <button style={{ ...activeButton, marginLeft: 18 }} onClick={() => window.scrollTo(0, 0)}>Active</button>}
          </h3>
          {queueSongs.length === 0 ? <div style={{ color: "#bbb" }}>No songs queued.</div> :
            <ul style={{ padding: 0 }}>
              {queueSongs.map((s, i) =>
                <li key={s.Song_ID + "_" + i}
                  style={{
                    background: "#191c35", margin: "6px 0", borderRadius: 6, padding: 12,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    boxShadow: "0 2px 8px #191c3544"
                  }}>
                  <span><b style={{ color: accent }}>{i + 1}.</b> {s.Title} <span style={{ color: "#bbb" }}>({formatDuration(s.Duration)})</span></span>
                  <div>
                    <button style={buttonStyle} onClick={() => playSong(s)}>▶</button>
                    <button style={{ ...buttonStyle, background: accent2 }} onClick={() => removeFromQueue(currentQueueId, s.Song_ID)}>Remove</button>
                    <button style={buttonStyle} onClick={() => moveSong(i, "up")}>↑</button>
                    <button style={buttonStyle} onClick={() => moveSong(i, "down")}>↓</button>
                  </div>
                </li>
              )}
            </ul>
          }
        </div>
      </div>
    </div>
  );
}

// --- Playlists Page ---
function PlaylistsPage({
  userData, allPlaylists, myPlaylists, collabPlaylists,
  setAllPlaylists, setMyPlaylists, setCollabPlaylists,
  playSong, users
}) {
  const [selected, setSelected] = useState(null);
  const [songs, setSongs] = useState([]);
  const [compilers, setCompilers] = useState([]);
  const [addUserId, setAddUserId] = useState("");
  const [addSongId, setAddSongId] = useState("");
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newParentId, setNewParentId] = useState("");
  const [playlistType, setPlaylistType] = useState("all");
  const [availableSongs, setAvailableSongs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playlistsRes, userPlaylistsRes, compileRes, usersRes, songsRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/playlists`),
          axios.get(`${BACKEND_URL}/playlists/user/${userData.User_ID}`),
          axios.get(`${BACKEND_URL}/playlist-compile`),
          axios.get(`${BACKEND_URL}/users`),
          axios.get(`${BACKEND_URL}/songs`)
        ]);
        
        setAllPlaylists(playlistsRes.data || []);
        setMyPlaylists(userPlaylistsRes.data || []);
        setCollabPlaylists(compileRes.data.filter(row => row.User_ID === userData.User_ID) || []);
        setUsers(usersRes.data || []);
        setAvailableSongs(songsRes.data || []);
      } catch (err) {
        console.error("Error fetching playlist data:", err);
      }
    };
    fetchData();
  }, [userData]);

  useEffect(() => {
    if (selected) {
      const fetchPlaylistDetails = async () => {
        try {
          const [contentsRes, compileRes] = await Promise.all([
            axios.get(`${BACKEND_URL}/playlist-contents/playlist/${selected.Playlist_ID}`),
            axios.get(`${BACKEND_URL}/playlist-compile`)
          ]);
          
          let list = [...(contentsRes.data || [])].sort((a, b) => a.Custom_index - b.Custom_index);
          for (let i = 0; i < list.length; i++) {
            if (list[i].Custom_index !== i) {
              await axios.put(`${BACKEND_URL}/playlist-contents`, { 
                Playlist_ID: selected.Playlist_ID, 
                Song_ID: list[i].Song_ID, 
                Custom_index: i 
              });
              list[i].Custom_index = i;
            }
          }
          setSongs(list);
          setCompilers(compileRes.data.filter(row => row.Playlist_ID === selected.Playlist_ID) || []);
        } catch (err) {
          console.error("Error fetching playlist details:", err);
          setSongs([]);
          setCompilers([]);
        }
      };
      fetchPlaylistDetails();
    }
  }, [selected]);

  const isOwner = selected && userData.User_ID === selected.Owner_UID;
  const isCollaborator = selected && compilers.some(c => c.User_ID === userData.User_ID);
  const collaboratorUsers = compilers.map(c => users.find(u => u.User_ID === c.User_ID)).filter(Boolean);

  const handleCreate = async () => {
    if (!newPlaylistName.trim()) return;
    try {
      await axios.post(`${BACKEND_URL}/playlists`, { 
        Name: newPlaylistName, 
        Owner_UID: userData.User_ID, 
        Parent_playlist: newParentId || null 
      });
      setNewPlaylistName(""); 
      setNewParentId("");
      
      const [playlistsRes, userPlaylistsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/playlists`),
        axios.get(`${BACKEND_URL}/playlists/user/${userData.User_ID}`)
      ]);
      setAllPlaylists(playlistsRes.data);
      setMyPlaylists(userPlaylistsRes.data);
    } catch (err) {
      console.error("Error creating playlist:", err);
    }
  };

  const handleDelete = async (pid) => {
    try {
      await axios.delete(`${BACKEND_URL}/playlists/${pid}`);
      setSelected(null);
      
      const [playlistsRes, userPlaylistsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/playlists`),
        axios.get(`${BACKEND_URL}/playlists/user/${userData.User_ID}`)
      ]);
      setAllPlaylists(playlistsRes.data);
      setMyPlaylists(userPlaylistsRes.data);
    } catch (err) {
      console.error("Error deleting playlist:", err);
    }
  };

  const addCompiler = async () => {
    if (!addUserId) return;
    try {
      await axios.post(`${BACKEND_URL}/playlist-compile`, { 
        Playlist_ID: selected.Playlist_ID, 
        User_ID: Number(addUserId) 
      });
      setAddUserId("");
      
      const compileRes = await axios.get(`${BACKEND_URL}/playlist-compile`);
      setCompilers(compileRes.data.filter(row => row.Playlist_ID === selected.Playlist_ID));
    } catch (err) {
      console.error("Error adding collaborator:", err);
    }
  };

  const removeCompiler = async (uid) => {
    try {
      await axios.delete(`${BACKEND_URL}/playlist-compile`, { 
        data: { Playlist_ID: selected.Playlist_ID, User_ID: uid } 
      });
      
      const compileRes = await axios.get(`${BACKEND_URL}/playlist-compile`);
      setCompilers(compileRes.data.filter(row => row.Playlist_ID === selected.Playlist_ID));
    } catch (err) {
      console.error("Error removing collaborator:", err);
    }
  };

  const addSong = async () => {
    if (!addSongId) return;
    try {
      await axios.post(`${BACKEND_URL}/playlist-contents`, { 
        Playlist_ID: selected.Playlist_ID, 
        Song_ID: Number(addSongId), 
        Custom_index: songs.length 
      });
      setAddSongId("");
      
      const contentsRes = await axios.get(`${BACKEND_URL}/playlist-contents/playlist/${selected.Playlist_ID}`);
      setSongs(contentsRes.data);
    } catch (err) {
      console.error("Error adding song to playlist:", err);
    }
  };

  const removeSong = async (sid) => {
    try {
      await axios.delete(`${BACKEND_URL}/playlist-contents`, { 
        data: { Playlist_ID: selected.Playlist_ID, Song_ID: sid } 
      });
      
      const contentsRes = await axios.get(`${BACKEND_URL}/playlist-contents/playlist/${selected.Playlist_ID}`);
      setSongs(contentsRes.data);
    } catch (err) {
      console.error("Error removing song from playlist:", err);
    }
  };

  const moveSong = async (idx, dir) => {
    let toIdx = null;
    if (dir === "up" && idx > 0) toIdx = idx - 1;
    if (dir === "down" && idx < songs.length - 1) toIdx = idx + 1;
    if (toIdx !== null) {
      try {
        await Promise.all([
          axios.put(`${BACKEND_URL}/playlist-contents`, { 
            Playlist_ID: selected.Playlist_ID, 
            Song_ID: songs[idx].Song_ID, 
            Custom_index: toIdx 
          }),
          axios.put(`${BACKEND_URL}/playlist-contents`, { 
            Playlist_ID: selected.Playlist_ID, 
            Song_ID: songs[toIdx].Song_ID, 
            Custom_index: idx 
          })
        ]);
        
        const contentsRes = await axios.get(`${BACKEND_URL}/playlist-contents/playlist/${selected.Playlist_ID}`);
        setSongs(contentsRes.data);
      } catch (err) {
        console.error("Error moving song:", err);
      }
    }
  };

  let playlistsList = playlistType === "all" ? allPlaylists : [...myPlaylists, ...collabPlaylists].filter((p, i, a) => a.findIndex(z => z.Playlist_ID === p.Playlist_ID) === i);

  // Get child playlists for selected playlist
  const childPlaylists = selected ? allPlaylists.filter(p => p.Parent_playlist === selected.Playlist_ID) : [];

  return (
    <div style={cardStyle}>
      <h2><span style={{ color: accent2 }}>Playlists</span></h2>
      <div style={{ marginBottom: "1rem" }}>
        <button style={playlistType === "all" ? activeButton : buttonStyle} onClick={() => setPlaylistType("all")}>All Playlists</button>
        <button style={playlistType === "my" ? activeButton : buttonStyle} onClick={() => setPlaylistType("my")}>My Playlists + Collaborations</button>
      </div>
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ width: 280 }}>
          <input
            placeholder="Playlist name"
            value={newPlaylistName}
            onChange={e => setNewPlaylistName(e.target.value)}
            style={{ ...inputStyle, marginBottom: "0.5rem" }}
            aria-label="Input new playlist name"
          />
          <select value={newParentId} onChange={e => setNewParentId(e.target.value)} style={{ ...inputStyle, marginBottom: "0.5rem" }} aria-label="Select parent playlist">
            <option value="">No Parent Playlist</option>
            {allPlaylists.map(p => <option key={p.Playlist_ID} value={p.Playlist_ID}>{p.Name}</option>)}
          </select>
          <button style={buttonStyle} onClick={handleCreate}>Create Playlist</button>
          <hr style={hrStyle} />
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {playlistsList.map(p =>
              <li key={p.Playlist_ID} style={{
                background: selected && selected.Playlist_ID === p.Playlist_ID ? accent : "#1b1c3e",
                borderRadius: 5,
                margin: "5px 0",
                fontWeight: "bold",
                cursor: "pointer",
                padding: "0.7rem 1.1rem",
                color: selected && selected.Playlist_ID === p.Playlist_ID ? textColor : null,
                userSelect: "none",
              }}
                onClick={() => setSelected(p)}
                tabIndex={0}
                onKeyDown={ev => { if (ev.key === "Enter") setSelected(p) }}
                role="button"
                aria-selected={selected && selected.Playlist_ID === p.Playlist_ID}
              >
                {p.Name} {p.Parent_playlist ? `(Parent: ${allPlaylists.find(x => x.Playlist_ID === p.Parent_playlist)?.Name || p.Parent_playlist})` : ""}
                {userData.User_ID === p.Owner_UID && (
                  <button 
                    style={{ ...buttonStyle, background: accent2, float: "right" }} 
                    aria-label={`Delete playlist ${p.Name}`} 
                    onClick={(e) => { e.stopPropagation(); handleDelete(p.Playlist_ID); }}
                  >
                    Del
                  </button>
                )}
              </li>
            )}
          </ul>
        </div>

        <div style={{ flex: 1 }}>
          {selected && (
            <div style={{ background: "#23255c", borderRadius: 10, padding: 20, userSelect: "none" }}>
              <h3>{selected.Name}</h3>

              {/* Child Playlists */}
              {childPlaylists.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontWeight: "bold", color: accent3 }}>Child Playlists:</span>
                  <ul>
                    {childPlaylists.map(child => (
                      <li key={child.Playlist_ID} style={{ cursor: "pointer" }} onClick={() => setSelected(child)}>
                        {child.Name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Collaborators */}
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontWeight: "bold", color: accent3 }}>Collaborators:</span>
                <ul>
                  {collaboratorUsers.length === 0 ? <li><i>None</i></li> : collaboratorUsers.map(u =>
                    <li key={u.User_ID}>
                      {u.Name} ({u.User_ID})
                      {isOwner && u.User_ID !== userData.User_ID && (
                        <button style={buttonStyle} onClick={() => removeCompiler(u.User_ID)}>Remove</button>
                      )}
                    </li>
                  )}
                </ul>

                {isOwner && (
                  <>
                    <select
                      value={addUserId}
                      onChange={e => setAddUserId(e.target.value)}
                      style={{ ...inputStyle, maxWidth: 240, marginBottom: "0.5rem" }}
                      aria-label="Select user to add as collaborator"
                    >
                      <option value="">Add collaborator</option>
                      {users.filter(u => !compilers.some(c => c.User_ID === u.User_ID)).map(u =>
                        <option key={u.User_ID} value={u.User_ID}>{u.Name} (ID: {u.User_ID})</option>)}
                    </select>
                    <button style={buttonStyle} onClick={addCompiler}>Add Collaborator</button>
                  </>
                )}
              </div>

              <hr style={hrStyle} />

              <div style={{ marginBottom: 20 }}>
                <span style={{ fontWeight: "bold" }}>Playlist Songs</span>

                {(isOwner || isCollaborator) && (
                  <>
                    <select
                      value={addSongId}
                      onChange={e => setAddSongId(e.target.value)}
                      style={{ ...inputStyle, maxWidth: 250, marginBottom: "0.5rem" }}
                      aria-label="Select Song to add to playlist"
                    >
                      <option value="">Add Song</option>
                      {availableSongs.filter(s => !songs.some(ps => ps.Song_ID === s.Song_ID)).map(s => 
                        <option key={s.Song_ID} value={s.Song_ID}>{s.Title}</option>)}
                    </select>
                    <button style={buttonStyle} onClick={addSong}>Add Song</button>
                  </>
                )}
              </div>

              <ul style={{ maxHeight: "380px", overflowY: "auto", listStyle: "none", padding: 0 }}>
                {songs.map((s, i) =>
                  <li key={s.Song_ID} style={{
                    background: "#191c35",
                    borderRadius: 6,
                    margin: "6px 0",
                    padding: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <span>
                      <b>{i + 1}.</b> {s.Title}
                    </span>
                    <div>
                      <button style={buttonStyle} onClick={() => playSong(s)}>Play</button>
                      {(isOwner || isCollaborator) && (
                        <>
                          <button style={{ ...buttonStyle, background: accent2 }} onClick={() => removeSong(s.Song_ID)}>Remove</button>
                          <button style={smallButton} onClick={() => moveSong(i, "up")} aria-label="Move song up">↑</button>
                          <button style={smallButton} onClick={() => moveSong(i, "down")} aria-label="Move song down">↓</button>
                        </>
                      )}
                    </div>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- History Page ---
function HistoryPage({ userData, history, fetchHistory, clearHistory, playSong }) {
  useEffect(() => { 
    fetchHistory(); 
  }, [fetchHistory]);

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear your listening history?")) {
      await clearHistory();
    }
  };

  return (
    <div style={cardStyle}>
      <h2><span style={{ color: accent2 }}>Listening History</span></h2>
      <button style={{ ...buttonStyle, background: accent2 }} onClick={handleClearHistory}>Clear History</button>
      <ul style={{ maxHeight: 400, overflowY: "auto", paddingLeft: 0, listStyle: "none" }}>
        {history.length === 0 ?
          <div style={{ color: "#bbb", textAlign: "center", padding: "2rem" }}>No history found.</div> :
          history.map((h, i) =>
            <li key={i} style={{
              background: "#191c35", borderRadius: 6, margin: "7px 0", padding: 14, 
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <span>
                <b>{h.Title}</b> 
                <span style={{ color: accent2, marginLeft: "1rem" }}>
                  {h.Timestamp ? new Date(h.Timestamp).toLocaleString() : ""}
                </span>
              </span>
              <button style={buttonStyle} onClick={() => playSong(h)}>▶</button>
            </li>
          )}
      </ul>
    </div>
  );
}

// --- Artists Page ---
function ArtistsPage({ userData, artists, follows, followArtist, unfollowArtist }) {
  return (
    <div style={cardStyle}>
      <h2><span style={{ color: accent2 }}>Artists</span></h2>
      
      {follows.length > 0 && (
        <>
          <h3>Artists You Follow</h3>
          <ul style={{ maxHeight: 200, overflowY: "auto", paddingLeft: 0, listStyle: "none" }}>
            {follows.map(a => (
              <li key={a.Artist_ID} style={{
                background: "#191c35",
                borderRadius: 6,
                margin: "5px 0",
                padding: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <span>
                  <b>{a.Name}</b> <span style={{ color: "#aaf" }}>({a.Country || "Unknown"})</span>
                  <div style={{ fontStyle: "italic", color: "#aaa", fontSize: 14 }}>{a.Bio || "No bio available."}</div>
                </span>
                <button style={{ ...buttonStyle, background: accent3 }}
                  onClick={() => unfollowArtist(a.Artist_ID)}
                >
                  Unfollow
                </button>
              </li>
            ))}
          </ul>
          <hr style={hrStyle} />
        </>
      )}

      <h3>All Artists</h3>
      <ul style={{ maxHeight: 450, overflowY: "auto", paddingLeft: 0, listStyle: "none" }}>
        {artists.map(a => {
          const followed = follows.some(f => f.Artist_ID === a.Artist_ID);
          return (
            <li key={a.Artist_ID} style={{
              background: "#191c35",
              borderRadius: 6,
              margin: "5px 0",
              padding: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <span>
                <b>{a.Name}</b> <span style={{ color: "#aaf" }}>({a.Country || "Unknown"})</span>
                <div style={{ fontStyle: "italic", color: "#aaa", fontSize: 14 }}>{a.Bio || "No bio available."}</div>
              </span>
              {userData.accountType === "User" && (
                <button style={followed ? { ...buttonStyle, background: accent3 } : buttonStyle}
                  onClick={() => followed ? unfollowArtist(a.Artist_ID) : followArtist(a.Artist_ID)}
                >
                  {followed ? "Unfollow" : "Follow"}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// --- Radio Page ---
function RadioPage({ userData, stations, selectedStation, setSelectedStation, stationSongs, playSong, isAdmin, createRadio, addSongToRadio, fetchStations }) {
  const [newRadioName, setNewRadioName] = useState("");
  const [newRadioDesc, setNewRadioDesc] = useState("");
  const [newRadioGenre, setNewRadioGenre] = useState("");
  const [songToAdd, setSongToAdd] = useState("");
  const [allSongs, setAllSongs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const songsRes = await axios.get(`${BACKEND_URL}/songs`);
        setAllSongs(songsRes.data || []);
      } catch (err) {
        console.error("Error fetching songs:", err);
      }
    };
    fetchData();
  }, []);

  const handleCreateRadio = async () => {
    if (!newRadioName.trim()) {
      alert("Radio name required");
      return;
    }
    try {
      await createRadio({ 
        Name: newRadioName, 
        Description: newRadioDesc, 
        Date_Created: new Date().toISOString().slice(0, 10), 
        Genre: newRadioGenre 
      });
      setNewRadioName(""); 
      setNewRadioDesc(""); 
      setNewRadioGenre("");
      fetchStations();
    } catch (err) {
      console.error("Error creating radio:", err);
      alert("Error creating radio station");
    }
  };

  const handleAddSong = async () => {
    if (!songToAdd || !selectedStation) return;
    try {
      await addSongToRadio(selectedStation.Station_ID, songToAdd);
      setSongToAdd("");
    } catch (err) {
      console.error("Error adding song to radio:", err);
      alert("Error adding song to radio");
    }
  };

  return (
    <div style={cardStyle}>
      <h2><span style={{ color: accent2 }}>Radio Stations</span></h2>
      <div style={{
        display: "flex",
        gap: 24,
        flexWrap: "wrap",
        justifyContent: "space-between"
      }}>
        <div style={{ minWidth: 250, maxHeight: 380, overflowY: "auto" }}>
          <h3>Available Stations</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {stations.map(s =>
              <li key={s.Station_ID} style={{
                background: selectedStation && selectedStation.Station_ID === s.Station_ID ? accent : "#191c35",
                borderRadius: 6,
                marginBottom: 6,
                cursor: "pointer",
                padding: 10,
                fontWeight: "bold",
                color: selectedStation && selectedStation.Station_ID === s.Station_ID ? textColor : null
              }} onClick={() => setSelectedStation(s)} tabIndex={0} onKeyDown={e => { if (e.key === "Enter") setSelectedStation(s) }} role="button" aria-selected={selectedStation && selectedStation.Station_ID === s.Station_ID}>
                {s.Name} <br />
                <small style={{ color: "#6a87c1" }}>{s.Genre || "No genre"}</small>
              </li>
            )}
          </ul>

          {isAdmin && (
            <>
              <hr style={hrStyle} />
              <h4>Create New Radio</h4>
              <input 
                placeholder="Name" 
                value={newRadioName} 
                onChange={e => setNewRadioName(e.target.value)} 
                style={{ ...inputStyle, marginBottom: "0.5rem" }} 
              />
              <input 
                placeholder="Description" 
                value={newRadioDesc} 
                onChange={e => setNewRadioDesc(e.target.value)} 
                style={{ ...inputStyle, marginBottom: "0.5rem" }} 
              />
              <input 
                placeholder="Genre" 
                value={newRadioGenre} 
                onChange={e => setNewRadioGenre(e.target.value)} 
                style={{ ...inputStyle, marginBottom: "0.5rem" }} 
              />
              <button style={buttonStyle} onClick={handleCreateRadio}>Create Radio</button>
            </>
          )}
        </div>

        {selectedStation && (
          <div style={{ flex: 1, maxHeight: 380, overflowY: "auto" }}>
            <h3>{selectedStation.Name} - Songs</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {stationSongs.map(s =>
                <li key={s.Song_ID} style={{
                  background: "#191c35",
                  borderRadius: 6,
                  marginBottom: 6,
                  display: "flex",
                  justifyContent: "space-between",
                  padding: 10
                }}>
                  <div>{s.Title} ({formatDuration(s.Duration)})</div>
                  <button style={buttonStyle} onClick={() => playSong(s)}>▶</button>
                </li>
              )}
            </ul>
            {isAdmin && (
              <>
                <select 
                  value={songToAdd} 
                  onChange={e => setSongToAdd(e.target.value)} 
                  style={{ ...inputStyle, marginBottom: "0.5rem" }}
                >
                  <option value="">Add Song to Radio</option>
                  {allSongs.filter(s => !stationSongs.some(rs => rs.Song_ID === s.Song_ID)).map(s => 
                    <option key={s.Song_ID} value={s.Song_ID}>{s.Title}</option>)}
                </select>
                <button style={buttonStyle} onClick={handleAddSong}>Add Song</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Main App ---
function App() {
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState("login");

  // Queues
  const [queues, setQueues] = useState([]);
  const [currentQueueId, setCurrentQueueId] = useState(null);
  const [queueSongs, setQueueSongs] = useState([]);

  // Playlists
  const [allPlaylists, setAllPlaylists] = useState([]);
  const [myPlaylists, setMyPlaylists] = useState([]);
  const [collabPlaylists, setCollabPlaylists] = useState([]);
  const [users, setUsers] = useState([]);

  // Artists & follows
  const [artists, setArtists] = useState([]);
  const [follows, setFollows] = useState([]);

  // History
  const [history, setHistory] = useState([]);

  // Radio stations & songs
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [stationSongs, setStationSongs] = useState([]);

  // Likes, ratings
  const [likedSongIDs, setLikedSongIDs] = useState([]);
  const [ratings, setRatings] = useState({});

  // Player
  const [currentSong, setCurrentSong] = useState(null);
  const audioRef = useRef(null);

  // Auth check
  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (stored) {
      setUserData(JSON.parse(stored));
      setView("dashboard");
    }
  }, []);

  // Data fetching
  useEffect(() => {
    if (!userData && view !== "login") setView("login");
    if (userData && userData.accountType === "User") {
      fetchInitialData();
    }
  }, [userData]);

  const fetchInitialData = async () => {
    try {
      const [queuesRes, usersRes, playlistsRes, userPlaylistsRes, compileRes, artistsRes, followsRes, historyRes, stationsRes, likesRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/queue/user/${userData.User_ID}`),
        axios.get(`${BACKEND_URL}/users`),
        axios.get(`${BACKEND_URL}/playlists`),
        axios.get(`${BACKEND_URL}/playlists/user/${userData.User_ID}`),
        axios.get(`${BACKEND_URL}/playlist-compile`),
        axios.get(`${BACKEND_URL}/artists`),
        axios.get(`${BACKEND_URL}/follow/user/${userData.User_ID}`),
        axios.get(`${BACKEND_URL}/history-contents/${userData.User_ID}`),
        axios.get(`${BACKEND_URL}/radio-stations`),
        axios.get(`${BACKEND_URL}/likes/user/${userData.User_ID}`)
      ]);

      setQueues(queuesRes.data || []);
      if (queuesRes.data && queuesRes.data.length > 0) {
        setCurrentQueueId(queuesRes.data[0].Queue_ID);
      }
      setUsers(usersRes.data || []);
      setAllPlaylists(playlistsRes.data || []);
      setMyPlaylists(userPlaylistsRes.data || []);
      setCollabPlaylists(compileRes.data.filter(row => row.User_ID === userData.User_ID) || []);
      setArtists(artistsRes.data || []);
      setFollows(followsRes.data || []);
      setHistory(historyRes.data || []);
      setStations(stationsRes.data || []);
      setLikedSongIDs(likesRes.data.map(x => x.Song_ID) || []);
    } catch (err) {
      console.error("Error fetching initial data:", err);
    }
  };

  // Queue songs fetching
  useEffect(() => {
    if (currentQueueId) {
      fetchQueueSongs(currentQueueId);
    }
  }, [currentQueueId]);

  // Station songs fetching
  useEffect(() => {
    if (selectedStation) {
      fetchStationSongs();
    }
  }, [selectedStation]);

  // Queue functions
  const fetchQueues = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/queue/user/${userData.User_ID}`);
      setQueues(res.data || []);
    } catch (err) {
      console.error("Error fetching queues:", err);
    }
  };

  const fetchQueueSongs = async (queueId) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/queue-contents/queue/${queueId}`);
      setQueueSongs(res.data || []);
    } catch (err) {
      console.error("Error fetching queue songs:", err);
      setQueueSongs([]);
    }
  };

  const addToQueue = async (song, queueId) => {
    if (!queueId) return;
    try {
      await axios.post(`${BACKEND_URL}/queue-contents`, { 
        Queue_ID: queueId, 
        Song_ID: song.Song_ID, 
        Custom_index: queueSongs.length 
      });
      fetchQueueSongs(queueId);
    } catch (err) {
      console.error("Error adding to queue:", err);
    }
  };

  const removeFromQueue = async (queueId, songId) => {
    try {
      await axios.delete(`${BACKEND_URL}/queue-contents`, { 
        data: { Queue_ID: queueId, Song_ID: songId } 
      });
      fetchQueueSongs(queueId);
    } catch (err) {
      console.error("Error removing from queue:", err);
    }
  };

  const sortQueue = async (queueId, from, to) => {
    if (from === to) return;
    try {
      const list = [...queueSongs];
      const [moved] = list.splice(from, 1);
      list.splice(to, 0, moved);
      await Promise.all(list.map((s, i) => 
        axios.put(`${BACKEND_URL}/queue-contents`, { 
          Queue_ID: queueId, 
          Song_ID: s.Song_ID, 
          Custom_index: i 
        })
      ));
      fetchQueueSongs(queueId);
    } catch (err) {
      console.error("Error sorting queue:", err);
    }
  };

  const addQueueDB = async (incognito) => {
    try {
      await axios.post(`${BACKEND_URL}/queue`, { 
        User_ID: userData.User_ID, 
        Incognito: incognito ? 1 : 0 
      });
      fetchQueues();
    } catch (err) {
      console.error("Error adding queue:", err);
    }
  };

  const deleteQueue = async (queueId) => {
    try {
      await axios.delete(`${BACKEND_URL}/queue/${queueId}`);
      fetchQueues();
    } catch (err) {
      console.error("Error deleting queue:", err);
    }
  };

  // Like functions
  const likeSong = async (songId) => {
    try {
      await axios.post(`${BACKEND_URL}/likes`, { 
        User_ID: userData.User_ID, 
        Song_ID: songId 
      });
      setLikedSongIDs(prev => [...prev, songId]);
    } catch (err) {
      console.error("Error liking song:", err);
    }
  };

  const unlikeSong = async (songId) => {
    try {
      await axios.delete(`${BACKEND_URL}/likes`, { 
        data: { User_ID: userData.User_ID, Song_ID: songId } 
      });
      setLikedSongIDs(prev => prev.filter(id => id !== songId));
    } catch (err) {
      console.error("Error unliking song:", err);
    }
  };

  // Rating functions
  const rateSong = async (songId, rating) => {
    try {
      await axios.post(`${BACKEND_URL}/rate`, { 
        User_ID: userData.User_ID, 
        Song_ID: songId, 
        Rating: rating 
      });
      setRatings(prev => ({ ...prev, [songId]: rating }));
    } catch (err) {
      console.error("Error rating song:", err);
    }
  };

  const getRating = (songId) => {
    return ratings[songId] || 0;
  };

  // Artist functions
  const followArtist = async (artistId) => {
    try {
      await axios.post(`${BACKEND_URL}/follow`, { 
        User_ID: userData.User_ID, 
        Artist_ID: artistId 
      });
      const res = await axios.get(`${BACKEND_URL}/follow/user/${userData.User_ID}`);
      setFollows(res.data);
    } catch (err) {
      console.error("Error following artist:", err);
    }
  };

  const unfollowArtist = async (artistId) => {
    try {
      await axios.delete(`${BACKEND_URL}/follow`, { 
        data: { User_ID: userData.User_ID, Artist_ID: artistId } 
      });
      const res = await axios.get(`${BACKEND_URL}/follow/user/${userData.User_ID}`);
      setFollows(res.data);
    } catch (err) {
      console.error("Error unfollowing artist:", err);
    }
  };

  // History functions
  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/history-contents/${userData.User_ID}`);
      setHistory(res.data || []);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const clearHistory = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/history/user/${userData.User_ID}`);
      setHistory([]);
    } catch (err) {
      console.error("Error clearing history:", err);
    }
  };

  const addToHistory = async (songId) => {
    try {
      await axios.post(`${BACKEND_URL}/history-contents`, { 
        User_ID: userData.User_ID, 
        Song_ID: songId 
      });
      fetchHistory();
    } catch (err) {
      console.error("Error adding to history:", err);
    }
  };

  // Radio functions
  const fetchStations = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/radio-stations`);
      setStations(res.data || []);
    } catch (err) {
      console.error("Error fetching stations:", err);
    }
  };

  const fetchStationSongs = async () => {
    if (!selectedStation) return;
    try {
      const res = await axios.get(`${BACKEND_URL}/radio-station-contents/station/${selectedStation.Station_ID}`);
      setStationSongs(res.data || []);
    } catch (err) {
      console.error("Error fetching station songs:", err);
      setStationSongs([]);
    }
  };

  const createRadio = async (radioData) => {
    try {
      await axios.post(`${BACKEND_URL}/radio-stations`, radioData);
      fetchStations();
    } catch (err) {
      console.error("Error creating radio:", err);
      throw err;
    }
  };

  const addSongToRadio = async (stationId, songId) => {
    try {
      await axios.post(`${BACKEND_URL}/radio-station-contents`, { 
        Station_ID: stationId, 
        Song_ID: songId 
      });
      fetchStationSongs();
    } catch (err) {
      console.error("Error adding song to radio:", err);
      throw err;
    }
  };

  // Player functions
  const handlePlaySong = async (song) => {
    const artistsForSong = song.ArtistsDisplay || "";
    setCurrentSong({ ...song, Url: "/songs/Yiruma-RiverFlowsInYou.mp3", ArtistsDisplay: artistsForSong });
    if (audioRef.current) {
      audioRef.current.src = "/songs/Yiruma-RiverFlowsInYou.mp3";
      audioRef.current.play().catch(err => console.error("Error playing audio:", err));
    }
    
    // Add to history if user is logged in
    if (userData && userData.accountType === "User") {
      addToHistory(song.Song_ID);
    }
  };

  const stopPlayer = () => { 
    if (audioRef.current) { 
      audioRef.current.pause(); 
      audioRef.current.currentTime = 0; 
    } 
    setCurrentSong(null); 
  };

  // Role checks
  const isUser = userData?.accountType === "User";
  const isArtist = userData?.accountType === "Artist";
  const isAdmin = userData?.Role === "admin";

  return (
    <div style={{ background: bgColor, minHeight: "100vh", color: textColor }}>
      <Navbar userData={userData} setUserData={setUserData} setView={setView} />
      <div style={{ maxWidth: 1000, margin: "0 auto", paddingBottom: 120 }}>
        {view === "login" ? (
          <AuthForm setUserData={setUserData} setView={setView} />
        ) : view === "dashboard" ? (
          <Dashboard userData={userData} />
        ) : view === "songs" && isUser ? (
          <SongsPage
            userData={userData} 
            queues={queues} 
            currentQueueId={currentQueueId} 
            setCurrentQueueId={setCurrentQueueId}
            addToQueue={addToQueue} 
            playSong={handlePlaySong}
            likeSong={likeSong} 
            unlikeSong={unlikeSong} 
            likedSongIDs={likedSongIDs} 
            rateSong={rateSong} 
            getRating={getRating}
          />
        ) : view === "queues" && isUser ? (
          <QueuePage
            userData={userData} 
            queues={queues} 
            currentQueueId={currentQueueId} 
            setCurrentQueueId={setCurrentQueueId} 
            queueSongs={queueSongs}
            fetchQueues={fetchQueues}
            fetchQueueSongs={fetchQueueSongs}
            playSong={handlePlaySong} 
            removeFromQueue={removeFromQueue} 
            sortQueue={sortQueue} 
            addQueueDB={addQueueDB} 
            deleteQueue={deleteQueue}
          />
        ) : view === "playlists" && isUser ? (
          <PlaylistsPage
            userData={userData} 
            allPlaylists={allPlaylists} 
            myPlaylists={myPlaylists} 
            collabPlaylists={collabPlaylists}
            setAllPlaylists={setAllPlaylists} 
            setMyPlaylists={setMyPlaylists} 
            setCollabPlaylists={setCollabPlaylists}
            playSong={handlePlaySong} 
            users={users}
          />
        ) : view === "history" && isUser ? (
          <HistoryPage
            userData={userData} 
            history={history}
            fetchHistory={fetchHistory}
            clearHistory={clearHistory}
            playSong={handlePlaySong}
          />
        ) : view === "artists" && isUser ? (
          <ArtistsPage
            userData={userData} 
            artists={artists} 
            follows={follows}
            followArtist={followArtist} 
            unfollowArtist={unfollowArtist}
          />
        ) : view === "radio" && isUser ? (
          <RadioPage
            userData={userData} 
            stations={stations} 
            selectedStation={selectedStation} 
            setSelectedStation={setSelectedStation} 
            stationSongs={stationSongs}
            playSong={handlePlaySong}
            isAdmin={false} 
            createRadio={createRadio} 
            addSongToRadio={addSongToRadio}
            fetchStations={fetchStations}
          />
        ) : view === "radioAdmin" && isAdmin ? (
          <RadioPage
            userData={userData} 
            stations={stations} 
            selectedStation={selectedStation} 
            setSelectedStation={setSelectedStation} 
            stationSongs={stationSongs}
            playSong={handlePlaySong}
            isAdmin={true} 
            createRadio={createRadio} 
            addSongToRadio={addSongToRadio}
            fetchStations={fetchStations}
          />
        ) : view === "release" && isArtist ? (
          <div style={cardStyle}>
            <h2>Artist Release Panel</h2>
            <p>Feature coming soon - manage your releases, add collaborations, and publish songs.</p>
          </div>
        ) : (
          <div style={cardStyle}>
            <h2>Page not found or access denied</h2>
          </div>
        )}
      </div>
      <PlayerBar currentSong={currentSong} audioRef={audioRef} stopPlayer={stopPlayer} />
    </div>
  );
}

// --- Utils ---
function formatDuration(seconds = 0) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default App;
