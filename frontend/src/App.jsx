// App.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// ---- ENV ----
const BACKEND_URL = "http://localhost:3000";

// ---- Utilities ----
const formatDuration = (seconds = 0) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
const mainBg = { background: 'linear-gradient(120deg, #1db954 0%, #191414 100%)', minHeight: '100vh', color: '#fff'};
const cardStyle = { background: '#222', borderRadius: '12px', margin: '1rem auto', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.15)', maxWidth: '750px' };
const buttonStyle = { border: "none", color: "#fff", background: "#1db954", cursor: "pointer", padding: "0.4rem 1.1rem", marginTop: "0.3rem", borderRadius: "5px", fontWeight: "bold" };
const inputStyle = { background:"#171717", color:"#eee", border:"1px solid #444", borderRadius:"5px", padding:"0.7rem", width:"98%", marginBottom:"1rem", outline: "none" };

// ---- Navbar ----
const Navbar = ({ userData, setUserData, setView }) => {
  const handleLogout = () => {
    if (window.confirm("Logout?")) {
      localStorage.removeItem("userData");
      setUserData(null);
      setView("login");
    }
  };
  return (
    <nav style={{ background: "#191414", color: "#fff", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: '0 0 20px #1db95444' }}>
      <div style={{ fontWeight: "bold", fontSize: "2rem", cursor: "pointer", letterSpacing:"0.5px" }} onClick={() => setView("dashboard")}>Reverb</div>
      {userData && (
        <div>
          <button style={buttonStyle} onClick={() => setView("dashboard")}>Home</button>
          <button style={buttonStyle} onClick={() => setView("songs")}>Songs</button>
          <button style={buttonStyle} onClick={() => setView("playlists")}>Playlists</button>
          <button style={buttonStyle} onClick={() => setView("queues")}>Queue</button>
          <button style={buttonStyle} onClick={() => setView("artists")}>Artists</button>
          <button style={buttonStyle} onClick={() => setView("radio")}>Radio</button>
          <button style={buttonStyle} onClick={() => setView("history")}>History</button>
          <button style={buttonStyle} onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
};

// ---- Auth ----
const AuthForm = ({ setUserData, setView }) => {
  const [accountType, setAccountType] = useState("User");
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ Name: "", Email: "", Pass_hash: "" });
  const [error, setError] = useState("");
  const handleChange = e => setForm(v => ({ ...v, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
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
    <div style={{ ...cardStyle, background:'#1e1e1e', textAlign:"center", marginTop: "4rem", maxWidth:"390px"}}>
      <h2>{isRegister ? "Register" : "Login"} to <span style={{color:"#1db954"}}>Reverb</span></h2>
      <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
        <select name="Type" value={accountType} onChange={e => setAccountType(e.target.value)} style={inputStyle}>
          <option>User</option>
          <option>Artist</option>
        </select>
        {isRegister && (<input name="Name" type="text" placeholder="Name" value={form.Name} onChange={handleChange} required style={inputStyle} />)}
        <input name="Email" type="email" placeholder="Email" value={form.Email} onChange={handleChange} required style={inputStyle} />
        <input name="Pass_hash" type="password" placeholder="Password" value={form.Pass_hash} onChange={handleChange} required style={inputStyle} />
        <button type="submit" style={buttonStyle}>{isRegister ? `Register` : `Login`}</button>
        {error && <div style={{ color: "red", margin: "1rem 0 0 0"}}>{error}</div>}
      </form>
      <div style={{marginTop:'1rem', textDecoration:'underline', cursor:'pointer'}} onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Have an account? Login" : "No account? Register"}
      </div>
    </div>
  );
};

// ---- PlayerBar ----
const PlayerBar = ({ currentSong, audioRef, stopPlayer }) => {
  if (!currentSong) return null;
  return (
    <div style={{
      position:"fixed", bottom:0, left:0, right:0, background:"#191414", color:"#fff",
      boxShadow: "0 0 18px #1db95440", display:"flex", alignItems:"center", padding:"0.5rem 1.7rem",
      fontSize:"1.1rem", zIndex:99
    }}>
      <div style={{ flex:1 }}>{currentSong.Title} <span style={{color:"#81e258"}}>{formatDuration(currentSong.Duration)}</span></div>
      <audio ref={audioRef} src={currentSong.Url} controls autoPlay style={{ flex:3, maxWidth:"400px" }} onEnded={stopPlayer} />
      <button onClick={stopPlayer} style={{ ...buttonStyle, background:"#ee3333", marginLeft:"2rem" }}>Stop</button>
    </div>
  );
};

// ---- Dashboard ----
const Dashboard = ({ userData, queueSongs, setView, playSong }) => {
  return (
    <div style={{...cardStyle, marginTop:"3.5rem", background:"#1e322e"}}>
      <h2>Welcome <span style={{color:"#1db954"}}>{userData.Name}</span>!</h2>
      <div style={{marginBottom:"1.2rem"}}>Account Type: <b style={{color:"#91ffb2"}}>{userData.accountType}</b></div>
      <h3>Your Queue</h3>
      <ul>
        {queueSongs.length===0 ? <div style={{color:"#bbb"}}>No songs in queue.</div> :
          queueSongs.map((s,i) =>
            <li key={i} style={{marginBottom:'0.7rem', display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <span>{s.Title} <span style={{color:"#1db954"}}>({formatDuration(s.Duration)})</span></span>
              <button style={buttonStyle} onClick={() => playSong(s, false)}>Play</button>
            </li>)
        }
      </ul>
      <div style={{marginTop:"1.4rem"}}>Go explore: 
        <button style={buttonStyle} onClick={()=>setView("songs")}>Songs</button> 
        <button style={buttonStyle} onClick={()=>setView("playlists")}>Playlists</button>
        <button style={buttonStyle} onClick={()=>setView("radio")}>Radio</button>
        <button style={buttonStyle} onClick={()=>setView("artists")}>Artists</button>
        <button style={buttonStyle} onClick={()=>setView("history")}>History</button>
      </div>
    </div>
  );
};

// ---- Songs ----
const SongsPage = ({ userData, playSong, fetchQueue, addToQueue, likeSong, unlikeSong, likedSongIDs, rateSong, getRating, addToHistory }) => {
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState("");
  const [collabArtists, setCollabArtists] = useState({});
  useEffect(()=>{
    axios.get(`${BACKEND_URL}/songs`).then(r=>setSongs(r.data));
  },[]);
  useEffect(()=>{
    // fetch collab info for each song
    songs.forEach(s=>{
      axios.get(`${BACKEND_URL}/compose/song/${s.Song_ID}`).then(res=>{
        setCollabArtists(ca =>({...ca, [s.Song_ID]: res.data}));
      });
    });
  }, [songs]);
  const filtered = songs.filter(s=>s.Title.toLowerCase().includes(query.toLowerCase()));
  const handleRating = async (song,rating)=>{
    await rateSong(song.Song_ID, rating);
  }
  return (
    <div style={cardStyle}>
      <h2><span style={{color:"#1db954"}}>Songs</span></h2>
      <input placeholder="Search song..." value={query} onChange={e=>setQuery(e.target.value)} style={inputStyle}/>
      <table style={{width:"100%", color:"#fff", background:"#171717", borderRadius:"6px", marginTop:"1rem", fontSize:"1.05rem"}}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Duration</th>
            <th>Artists</th>
            <th>Actions</th>
            <th>Likes</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(s=>
            <tr key={s.Song_ID}>
              <td>{s.Title}</td>
              <td>{formatDuration(s.Duration)}</td>
              <td>
                {(collabArtists[s.Song_ID]||[]).map(a=>a.Name).join(", ")||""}
              </td>
              <td>
                <button style={buttonStyle} onClick={()=>playSong(s, false)}>Play</button>
                <button style={buttonStyle} onClick={()=>addToQueue(s, false)}>+ Queue</button>
                <button style={{...buttonStyle, background:"#344"}} onClick={()=>addToQueue(s, true)}>+ Incognito</button>
                <button style={buttonStyle} onClick={()=>addToHistory(s.Song_ID)}>Add to History</button>
              </td>
              <td>
                {likedSongIDs.includes(s.Song_ID)?
                  <button style={{...buttonStyle, background:"#ee3333"}} onClick={()=>unlikeSong(s.Song_ID)}>Unlike 💔</button> :
                  <button style={buttonStyle} onClick={()=>likeSong(s.Song_ID)}>Like 💚</button>
                }
              </td>
              <td>
                {[1,2,3,4,5].map(r=>
                  <button key={r} style={{fontWeight:getRating(s.Song_ID)===r?'bold':'normal', 
                                        color:getRating(s.Song_ID)===r?'#f9d923':'#eee', background:'none', border:'none'}}
                    onClick={()=>handleRating(s,r)}>{r}</button>
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// ---- Queue System (DB Driven) ----
const QueuePage = ({ userData, queueSongs, fetchQueue, playSong, addToQueue, removeFromQueue, sortQueue }) => {
  const [dragIdx, setDragIdx]=useState(null);
  useEffect(()=>{fetchQueue();},[]);
  const handleDragStart=i=>{setDragIdx(i);}
  const handleDrop=i=>{
    if(dragIdx===null||dragIdx===i) return;
    sortQueue(dragIdx,i);
    setDragIdx(null);
  }
  return (
    <div style={cardStyle}>
      <h2><span style={{color:"#1db954"}}>Your Queue</span></h2>
      {queueSongs.length===0?
        <div style={{color:"#bbb"}}>No songs queued. Go add some!</div> : (
          <ul style={{padding:"0"}}>
            {queueSongs.map((s,i)=>
              <li
                key={s.Song_ID+"_"+i}
                draggable
                onDragStart={()=>handleDragStart(i)}
                onDragOver={e=>e.preventDefault()}
                onDrop={()=>handleDrop(i)}
                style={{
                  background:"#191919", margin:"6px 0", borderRadius:"6px", padding:"0.8rem",
                  display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 2px 8px #19141433",
                }}>
                <span>
                  <b style={{color:'#81e258'}}>{i+1}.</b> {s.Title} <span style={{color:'#bbb'}}>({formatDuration(s.Duration)})</span>
                </span>
                <div>
                  <button style={buttonStyle} onClick={()=>playSong(s, false)}>Play</button>
                  <button style={{...buttonStyle, background:"#ee3333"}} onClick={()=>removeFromQueue(s.Song_ID)}>Remove</button>
                </div>
              </li>
            )}
          </ul>
        )
      }
    </div>
  );
};

// ---- Playlists w/ Nested & Collaborative features ----
const PlaylistsPage = ({ userData, playSong }) => {
  const [playlists, setPlaylists] = useState([]);
  const [selected, setSelected] = useState(null);
  const [songs, setSongs] = useState([]);
  const [users, setUsers] = useState([]);
  const [newPlaylist, setNewPlaylist] = useState({ Name:"", Parent:null });
  const [addSongId, setAddSongId] = useState("");
  const [compilers, setCompilers] = useState([]);
  useEffect(() => {
    axios.get(`${BACKEND_URL}/playlists/user/${userData.User_ID}`).then(r => setPlaylists(r.data));
    axios.get(`${BACKEND_URL}/users`).then(r => setUsers(r.data));
  }, [userData]);
  useEffect(() => {
    if (!selected) return;
    axios.get(`${BACKEND_URL}/playlist-contents/playlist/${selected.Playlist_ID}`).then(r => setSongs(r.data));
    axios.get(`${BACKEND_URL}/playlist-compile`).then(r =>
      setCompilers(r.data.filter(p => p.Playlist_ID === selected.Playlist_ID))
    );
  }, [selected]);

  const createPlaylist = async () => {
    await axios.post(`${BACKEND_URL}/playlists`, {
      Name: newPlaylist.Name, Owner_UID: userData.User_ID, Parent_playlist: newPlaylist.Parent || null
    });
    setNewPlaylist({ Name:"", Parent:null });
    const res = await axios.get(`${BACKEND_URL}/playlists/user/${userData.User_ID}`);
    setPlaylists(res.data);
  };

  const addCompiler = async (uid) => {
    await axios.post(`${BACKEND_URL}/playlist-compile`,{Playlist_ID:selected.Playlist_ID,User_ID:uid});
    setCompilers([...compilers, users.find(u=>u.User_ID===uid)]);
  };

  const removeCompiler = async (uid) => {
    await axios.delete(`${BACKEND_URL}/playlist-compile`, {data:{Playlist_ID:selected.Playlist_ID,User_ID:uid}});
    setCompilers(compilers.filter(u=>u.User_ID!==uid));
  };

  const addSongToPlaylist = async () => {
    if (!addSongId) return;
    await axios.post(`${BACKEND_URL}/playlist-contents`, {Playlist_ID: selected.Playlist_ID, Song_ID: addSongId});
    axios.get(`${BACKEND_URL}/playlist-contents/playlist/${selected.Playlist_ID}`).then(r => setSongs(r.data));
    setAddSongId("");
  };

  const removeSongFromPlaylist = async (sid) => {
    await axios.delete(`${BACKEND_URL}/playlist-contents`, {data:{Playlist_ID:selected.Playlist_ID,Song_ID:sid}});
    setSongs(songs.filter(s=>s.Song_ID!==sid));
  };

  // Playlist sorting (reorder)
  const moveSong = async(idx, dir)=>{
    const newOrder = [...songs];
    if(dir==="up" && idx>0) [newOrder[idx-1],newOrder[idx]] = [newOrder[idx],newOrder[idx-1]];
    if(dir==="down" && idx<songs.length-1) [newOrder[idx+1],newOrder[idx]] = [newOrder[idx],newOrder[idx+1]];
    setSongs(newOrder);
    await Promise.all(newOrder.map((s,i)=>
      axios.put(`${BACKEND_URL}/playlist-contents`,{Playlist_ID:selected.Playlist_ID,Song_ID:s.Song_ID,Custom_index:i})
    ));
  };

  return (
    <div style={cardStyle}>
      <h2><span style={{color:"#1db954"}}>Playlists</span></h2>
      <div style={{display:"flex", gap:"2rem", flexWrap:"wrap"}}>
        <div style={{width:"270px"}}>
          <input
            placeholder="Playlist Name"
            value={newPlaylist.Name}
            style={inputStyle}
            onChange={e => setNewPlaylist(v => ({...v, Name: e.target.value}))}
          />
          <select value={newPlaylist.Parent||""} style={inputStyle}
            onChange={e => setNewPlaylist(v => ({...v, Parent: e.target.value||null}))}
          >
            <option value="">No Parent</option>
            {playlists.map(p=><option key={p.Playlist_ID} value={p.Playlist_ID}>{p.Name}</option>)}
          </select>
          <button style={buttonStyle} onClick={createPlaylist}>Create</button>
        </div>
        <div style={{flex:1}}>
          <ul style={{listStyle:'none', padding:"0"}}>
            {playlists.map(p =>
              <li key={p.Playlist_ID} style={{
                background:selected&&selected.Playlist_ID===p.Playlist_ID ? "#124c43" : "#191919",
                borderRadius:"5px", margin:"3px 0", fontWeight:"bold", cursor:"pointer", padding:"0.5rem 1.2rem"
              }} onClick={()=>setSelected(p)}>
                {p.Name} {p.Parent_playlist ? `(Parent: ${p.Parent_playlist})` : ""}
              </li>
            )}
          </ul>
        </div>
      </div>
      {/* Selected playlist: collaborative, contents, sorting */}
      {selected && (
        <div style={{
          background:"#101e13", borderRadius: "10px", marginTop: "2rem", padding:"1.2rem"
        }}>
          <h3>{selected.Name}</h3>
          <span style={{color:"#aaa"}}>Collaborators:</span>
          <ul>
            {compilers.map(u =>
              <li key={u.User_ID}>{u.User_ID} <button style={buttonStyle} onClick={()=>removeCompiler(u.User_ID)}>Remove</button></li>
            )}
          </ul>
          <select onChange={e=>addCompiler(Number(e.target.value))} style={inputStyle}>
            <option>Add Compiler (UserID)</option>
            {users.filter(u=>!compilers.some(c=>c.User_ID===u.User_ID)).map(u=>
              <option key={u.User_ID} value={u.User_ID}>{u.User_ID} ({u.Name})</option>
            )}
          </select>
          <hr style={{border:"none", borderTop:"1px solid #eee"}}/>
          <h4>Playlist Songs</h4>
          <select onChange={e=>setAddSongId(e.target.value)} style={inputStyle} value={addSongId}>
            <option value="">Add Song (SongID)</option>
            {songs.filter(s=>!songs.some(t=>t.Song_ID===s.Song_ID)).map(s=>
              <option key={s.Song_ID} value={s.Song_ID}>{s.Title}</option>
            )}
          </select>
          <button style={buttonStyle} onClick={addSongToPlaylist}>Add Song</button>
          <ul>
            {songs.map((s,i)=>
              <li key={s.Song_ID} style={{
                background:"#191919", borderRadius:"6px", margin:"5px 0", padding:"0.6rem", display:"flex",alignItems:"center"
              }}>
                <b>{i+1}.</b> {s.Title}
                <button style={buttonStyle} onClick={()=>playSong(s,false)}>Play</button>
                <button style={{...buttonStyle, background:"#ee3333"}} onClick={()=>removeSongFromPlaylist(s.Song_ID)}>Remove</button>
                <button style={buttonStyle} onClick={()=>moveSong(i,"up")}>↑</button>
                <button style={buttonStyle} onClick={()=>moveSong(i,"down")}>↓</button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

// ---- History ----
const HistoryPage = ({ userData, history, fetchHistory, clearHistory, playSong }) => {
  useEffect(()=>{fetchHistory();},[]);
  return (
    <div style={cardStyle}>
      <h2><span style={{color:"#1db954"}}>Listening History</span></h2>
      <button style={{...buttonStyle, background:"#ee3333"}} onClick={clearHistory}>Clear History</button>
      <ul>
        {history.length===0? <div style={{color:"#bbb"}}>No history found.</div> :
          history.map((h,i)=>
            <li key={i} style={{
              background:"#191919", borderRadius:"6px", margin:"7px 0", padding:"0.9rem", display:"flex",alignItems:"center", justifyContent:"space-between"
            }}>
              <span>
                <b>{h.Title}</b> <span style={{color:"#81e258"}}>{h.Timestamp? new Date(h.Timestamp).toLocaleString(): ""}</span>
              </span>
              <button style={buttonStyle} onClick={()=>playSong(h,false)}>Play</button>
            </li>
          )
        }
      </ul>
    </div>
  );
};

// ---- Artists ----
const ArtistsPage = ({ userData, follows, artists, followArtist, unfollowArtist }) => {
  return (
    <div style={cardStyle}>
      <h2><span style={{color:"#1db954"}}>Artists</span></h2>
      <ul>
        {artists.map(a=>{
          const followed = follows.some(f=>f.Artist_ID===a.Artist_ID);
          return (
            <li key={a.Artist_ID} style={{
              background:"#191919", borderRadius:"6px", margin:"5px 0", padding:"0.8rem", display:"flex",alignItems:"center", justifyContent:"space-between"
            }}>
              <span>
                <b>{a.Name}</b> <span style={{color:"#aaf"}}>({a.Country})</span> <span style={{fontStyle:"italic", color:'#bbb'}}>{a.Bio}</span>
              </span>
              {!followed?
                <button style={buttonStyle} onClick={()=>followArtist(a.Artist_ID)}>Follow</button> :
                <button style={{...buttonStyle, background:"#ee3333"}} onClick={()=>unfollowArtist(a.Artist_ID)}>Unfollow</button>
              }
            </li>
          );
        })}
      </ul>
      <h4>Artists you follow:</h4>
      <ul>
        {follows.map(a=><li key={a.Artist_ID}>{a.Name}</li>)}
      </ul>
    </div>
  );
};

// ---- Radio ----
const RadioStationsPage = ({ stations, selectedStation, selectStation, songs, playSong }) => (
  <div style={cardStyle}>
    <h2><span style={{color:'#1db954'}}>Radio Stations</span></h2>
    <div style={{display:'flex', gap:'2rem', flexWrap:'wrap'}}>
      <div style={{width:'230px'}}>
        <ul style={{listStyle:'none',padding:'0'}}>
          {stations.map(s=>
            <li key={s.Station_ID}
              style={{
                background:selectedStation&&selectedStation.Station_ID===s.Station_ID?'#124c43':'#191919',
                borderRadius:'5px',margin:'4px 0',fontWeight:'bold',cursor:'pointer',
                padding:'0.5rem 0.8rem'
              }}
              onClick={()=>selectStation(s)}
            >{s.Name}</li>
          )}
        </ul>
      </div>
      <div style={{flex:1}}>
        {selectedStation&&(
          <div style={{background:'#101e13', borderRadius:'12px', padding:'1rem'}}>
            <h3>{selectedStation.Name}</h3>
            <ul>
              {songs.map(song=>
                <li key={song.Song_ID} style={{marginBottom:'0.5rem'}}>
                  {song.Title} ({formatDuration(song.Duration)})
                  <button style={buttonStyle} onClick={()=>playSong(song,false)}>Play</button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  </div>
);

// ---- MAIN ----
const App = () => {
  // User/auth/view states
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState("login");

  // ---- GLOBAL QUEUE ----
  const [queueSongs, setQueueSongs] = useState([]);
  const [queueId, setQueueId] = useState(null);

  // ---- History ----
  const [history, setHistory] = useState([]);

  // ---- Artists ----
  const [artists, setArtists] = useState([]);
  const [follows, setFollows] = useState([]);

  // ---- Likes ----
  const [likedSongIDs, setLikedSongIDs] = useState([]);

  // ---- Song Ratings ----
  const [ratings, setRatings] = useState({});

  // ---- Player ----
  const [currentSong, setCurrentSong] = useState(null);
  const audioRef = useRef(null);

  // ---- Radio ----
  const [stations, setStations] = useState([]);
  const [selectedStation, selectStation] = useState(null);
  const [stationSongs, setStationSongs] = useState([]);

  // ---- Effect: Auth local ----
  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (stored) {
      setUserData(JSON.parse(stored));
      setView("dashboard");
    }
  }, []);

  useEffect(() => {
    if (!userData && view !== "login") setView("login");
    if (userData) {
      // Initial fetch: queue, history, follows, likes, artists, radio
      fetchQueue();
      fetchHistory();
      fetchFollows();
      fetchLikes();
      axios.get(`${BACKEND_URL}/artists`).then(r => setArtists(r.data));
      axios.get(`${BACKEND_URL}/radio-stations`).then(r=>setStations(r.data));
    }
  }, [userData]);

  // ---- QUEUE actions ----
  async function fetchQueue() {
    if (!userData) return;
    // Find/create queue for user
    let queueRes = await axios.get(`${BACKEND_URL}/queue/user/${userData.User_ID}`);
    let userQ = queueRes.data;
    if (!userQ) {
      // create
      const r = await axios.post(`${BACKEND_URL}/queue`, { User_ID: userData.User_ID, Incognito: false });
      userQ = { Queue_ID: r.data.Queue_ID, User_ID: userData.User_ID };
    }
    setQueueId(userQ.Queue_ID);
    // Songs
    let songsRes = await axios.get(`${BACKEND_URL}/queue-contents/queue/${userQ.Queue_ID}`);
    setQueueSongs(songsRes.data);
  }
  async function addToQueue(song, incognito) {
    if (!userData || !queueId) return;
    // Add song to queue (DB)
    await axios.post(`${BACKEND_URL}/queue-contents`, { Queue_ID: queueId, Song_ID: song.Song_ID, Custom_index: queueSongs.length });
    fetchQueue();
  }
  async function removeFromQueue(songId) {
    await axios.delete(`${BACKEND_URL}/queue-contents`, {data:{Queue_ID:queueId,Song_ID:songId}});
    fetchQueue();
  }
  async function sortQueue(fromIdx, toIdx) {
    if (fromIdx===toIdx) return;
    let newOrder = [...queueSongs];
    const [moved] = newOrder.splice(fromIdx,1);
    newOrder.splice(toIdx,0,moved);
    await Promise.all(newOrder.map((s,i)=>axios.put(`${BACKEND_URL}/queue-contents`,{Queue_ID:queueId,Song_ID:s.Song_ID,Custom_index:i})));
    fetchQueue();
  }

  // ---- PlaySong ----
  // On play: logs to history unless incognito, removes from queue
  const playSong = async (song, incognito=false) => {
    setCurrentSong({...song, Url:"/songs/Yiruma-RiverFlowsInYou.mp3"});
    if(audioRef.current){
      audioRef.current.src = "/songs/Yiruma-RiverFlowsInYou.mp3";
      audioRef.current.play();
    }
    // history: if not incognito
    if (userData && !incognito) addToHistory(song.Song_ID);
    // remove from queue
    if(queueSongs.some(s=>s.Song_ID===song.Song_ID)) removeFromQueue(song.Song_ID);
  };

  // ---- History actions ----
  async function fetchHistory() {
    if(!userData) return;
    const r = await axios.get(`${BACKEND_URL}/history-contents/${userData.User_ID}`);
    setHistory(r.data||[]);
  }
  async function addToHistory(songId){
    if(!userData) return;
    await axios.post(`${BACKEND_URL}/history-contents`, { User_ID: userData.User_ID, Song_ID: songId });
    fetchHistory();
  }
  async function clearHistory(){
    if(!userData) return;
    await axios.delete(`${BACKEND_URL}/history/user/${userData.User_ID}`);
    setHistory([]);
  }

  // ---- Likes ----
  async function fetchLikes() {
    if(!userData) return;
    let r = await axios.get(`${BACKEND_URL}/likes/user/${userData.User_ID}`);
    setLikedSongIDs(r.data.map(x=>x.Song_ID));
  }
  async function likeSong(songId) {
    await axios.post(`${BACKEND_URL}/likes`, { User_ID:userData.User_ID, Song_ID:songId });
    fetchLikes();
  }
  async function unlikeSong(songId) {
    await axios.delete(`${BACKEND_URL}/likes`, {data:{User_ID:userData.User_ID,Song_ID:songId}});
    fetchLikes();
  }

  // ---- Ratings ----
  useEffect(()=>{
    async function getAllRatings(){
      if(!userData) return;
      let rs = {};
      for(let songId of likedSongIDs){
        try{
          let r = await axios.get(`${BACKEND_URL}/rate/${userData.User_ID}/${songId}`);
          rs[songId] = r.data.Rating;
        }catch{}
      }
      setRatings(rs);
    }
    getAllRatings();
  }, [likedSongIDs, userData]);
  async function rateSong(songId, rating) {
    await axios.post(`${BACKEND_URL}/rate`, { User_ID:userData.User_ID, Song_ID:songId, Rating:rating });
    setRatings(rs=>({...rs,[songId]:rating}));
  }
  function getRating(songId){ return ratings[songId]||null; }

  // ---- Artists: follow system ----
  async function fetchFollows() {
    if(!userData) return;
    let r = await axios.get(`${BACKEND_URL}/follow/user/${userData.User_ID}`);
    setFollows(r.data);
  }
  async function followArtist(aid) {
    await axios.post(`${BACKEND_URL}/follow`,{User_ID:userData.User_ID,Artist_ID:aid});
    fetchFollows();
  }
  async function unfollowArtist(aid) {
    await axios.delete(`${BACKEND_URL}/follow`,{data:{User_ID:userData.User_ID,Artist_ID:aid}});
    fetchFollows();
  }

  // ---- Radio: fetch songs when selected ----
  useEffect(()=>{
    if(selectedStation){
      axios.get(`${BACKEND_URL}/radio-station-contents/station/${selectedStation.Station_ID}`)
        .then(r=>setStationSongs(r.data));
    }
  }, [selectedStation]);

  // ---- PlayerBar: Stop
  const stopPlayer = ()=>{
    if(audioRef.current){ audioRef.current.pause(); audioRef.current.currentTime=0; }
    setCurrentSong(null);
  };

  // ---- Render ----
  return (
    <div style={mainBg}>
      <Navbar userData={userData} setUserData={setUserData} setView={setView} />
      <div style={{maxWidth:"820px",margin:"0 auto",paddingBottom:"120px"}}>
      {view==="login" ? <AuthForm setUserData={setUserData} setView={setView}/> :
       view==="dashboard" ? <Dashboard userData={userData} queueSongs={queueSongs} setView={setView} playSong={playSong}/> :
       view==="songs" ? <SongsPage
         userData={userData}
         playSong={playSong}
         fetchQueue={fetchQueue}
         addToQueue={addToQueue}
         likeSong={likeSong}
         unlikeSong={unlikeSong}
         likedSongIDs={likedSongIDs}
         rateSong={rateSong}
         getRating={getRating}
         addToHistory={addToHistory}
       /> :
       view==="queues" ? <QueuePage
         userData={userData}
         queueSongs={queueSongs}
         fetchQueue={fetchQueue}
         playSong={playSong}
         addToQueue={addToQueue}
         removeFromQueue={removeFromQueue}
         sortQueue={sortQueue}
       /> :
       view==="playlists" ? <PlaylistsPage userData={userData} playSong={playSong} /> :
       view==="history" ? <HistoryPage userData={userData} history={history} fetchHistory={fetchHistory} clearHistory={clearHistory} playSong={playSong}/> :
       view==="artists" ? <ArtistsPage
         userData={userData}
         follows={follows}
         artists={artists}
         followArtist={followArtist}
         unfollowArtist={unfollowArtist}
       /> :
       view==="radio" ? <RadioStationsPage
         stations={stations}
         selectedStation={selectedStation}
         selectStation={selectStation}
         songs={stationSongs}
         playSong={playSong}
       /> : null}
      </div>
      <PlayerBar currentSong={currentSong} audioRef={audioRef} stopPlayer={stopPlayer} />
    </div>
  );
};

export default App;
