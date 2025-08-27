// App.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// ---- Config ----
const BACKEND_URL = "http://localhost:3000";

// ---- Utils ----
const formatDuration = (seconds = 0) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
const buttonStyle = { marginRight: "0.5rem", padding: "0.3rem 0.8rem", borderRadius: "4px", cursor: "pointer", background: "transparent", border: "1px solid #fff", color: "#fff" };
const inputStyle = { display:"block", width:"100%", marginBottom:"1rem", padding:"0.5rem" };

// ---- Navbar ----
const Navbar = ({ userData, setUserData, setView }) => {
  const handleLogout = () => {
    if (window.confirm("Do you want to logout?")) {
      localStorage.removeItem("userData");
      setUserData(null);
      setView("login");
    }
  };
  return (
    <nav style={{ padding: "1rem", background: "#1DB954", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontWeight: "bold", fontSize: "1.5rem", cursor: "pointer" }} onClick={() => setView("dashboard")}>Reverb</div>
      <div>
        {userData && (
          <>
            <button style={buttonStyle} onClick={() => setView("dashboard")}>Dashboard</button>
            <button style={buttonStyle} onClick={() => setView("songs")}>Songs</button>
            <button style={buttonStyle} onClick={() => setView("playlists")}>Playlists</button>
            <button style={buttonStyle} onClick={() => setView("history")}>History</button>
            <button style={buttonStyle} onClick={() => setView("radio")}>Radio</button>
            <button style={buttonStyle} onClick={() => setView("artists")}>Artists</button>
            <button style={buttonStyle} onClick={() => setView("queues")}>Queues</button>
            <button style={buttonStyle} onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

// ---- Auth ----
const AuthForm = ({ setUserData, setView }) => {
  const [accountType, setAccountType] = useState("User");
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    try {
      const endpoint = `/auth/${accountType.toLowerCase()}/${isRegister ? "register" : "login"}`;
      const payload = isRegister ? { Name: name, Email: email, Pass_hash: password } : { Email: email, Pass_hash: password };
      const res = await axios.post(`${BACKEND_URL}${endpoint}`, payload);
      const userObj = accountType === "User" ? res.data.user : res.data.artist;
      if (!userObj) throw new Error("Invalid response");
      const storedUser = { Name: userObj.Name, accountType, User_ID: userObj.User_ID || userObj.Artist_ID };
      localStorage.setItem("userData", JSON.stringify(storedUser));
      setUserData(storedUser);
      setView("dashboard");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Unknown error");
    }
  };
  return (
    <div style={{ maxWidth: "400px", margin: "3rem auto", padding: "2rem", borderRadius: "8px", background: "#f4f4f4", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
      <h2>{isRegister ? "Register" : "Login"}</h2>
      <select value={accountType} onChange={e => setAccountType(e.target.value)} style={{ marginBottom: "1rem", width: "100%" }}>
        <option>User</option>
        <option>Artist</option>
      </select>
      {isRegister && <input type="text" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required style={inputStyle} />}
      <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required style={inputStyle} />
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required style={inputStyle} />
      <button onClick={handleSubmit} style={{ ...inputStyle, background:"#1DB954", color:"#fff", border:"none" }}>{isRegister ? `Register as ${accountType}` : `Login as ${accountType}`}</button>
      {error && <p style={{ color:"red" }}>{error}</p>}
      <p style={{ marginTop:"1rem", cursor:"pointer", textDecoration:"underline" }} onClick={()=>setIsRegister(!isRegister)}>
        {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
      </p>
    </div>
  );
};

// ---- PlayerBar ----
const PlayerBar = ({ currentSong, audioRef, stopPlayer }) => {
  if (!currentSong) return null;
  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"#222", color:"#fff", display:"flex", alignItems:"center", padding:"0.5rem 1rem" }}>
      <div style={{ flex:1 }}>{currentSong.Title}</div>
      <audio ref={audioRef} src={currentSong.Url} controls autoPlay style={{ flex:3 }} onEnded={stopPlayer} />
      <button onClick={stopPlayer} style={{ marginLeft:"1rem", padding:"0.3rem 0.6rem", cursor:"pointer" }}>Stop</button>
    </div>
  );
};

// ---- Dashboard ----
const Dashboard = ({ userData, queues, currentQueueIndex, setQueues, playSong, setView }) => {
  const dashboardStyle = { padding:"2rem", flex:1 };
  const queueStyle = { maxHeight:"300px", overflowY:"auto", border:"1px solid #ccc", padding:"0.5rem", borderRadius:"8px" };
  const currentQueue = queues[currentQueueIndex];
  return (
    <div style={{ display:"flex" }}>
      <div style={{ width:"200px", padding:"1rem", background:"#222", color:"#fff" }}>
        <h3>Menu</h3>
        <p style={{ cursor:"pointer" }} onClick={()=>setView("dashboard")}>Dashboard</p>
        <p style={{ cursor:"pointer" }} onClick={()=>setView("songs")}>Songs</p>
        <p style={{ cursor:"pointer" }} onClick={()=>setView("playlists")}>Playlists</p>
        <p style={{ cursor:"pointer" }} onClick={()=>setView("queues")}>Queues</p>
        <p style={{ cursor:"pointer" }} onClick={()=>setView("radio")}>Radio</p>
        <p style={{ cursor:"pointer" }} onClick={()=>setView("history")}>History</p>
      </div>
      <div style={dashboardStyle}>
        <h2>Welcome {userData.Name} ({userData.accountType})</h2>
        <h3>Queue: {currentQueue.name}</h3>
        <div style={queueStyle}>
          {currentQueue.songs.length===0 ? <p>No songs in queue</p> : currentQueue.songs.map((song,i)=>(
            <div key={i} style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.5rem" }}>
              <span>{song.Title} ({formatDuration(song.Duration)})</span>
              <button onClick={()=>playSong(song, currentQueueIndex)} style={{ cursor:"pointer" }}>Play</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---- Songs Page ----
const SongsPage = ({ userData, queues, setQueues, currentQueueIndex, playSong, setView }) => {
  const [songs,setSongs] = useState([]); const [query,setQuery]=useState(""); const [ratings, setRatings]=useState({});
  useEffect(()=>{
    const fetchSongs = async()=>{
      try { 
        const res = await axios.get(`${BACKEND_URL}/songs`); setSongs(res.data);
        // Fetch user song ratings
        if (userData) {
          const rates = {};
          await Promise.all(res.data.map(async s => {
            try {
              const r = await axios.get(`${BACKEND_URL}/rate/${userData.User_ID}/${s.Song_ID}`);
              rates[s.Song_ID] = r.data?.Rating;
            } catch {} // ignore not found
          }));
          setRatings(rates);
        }
      } catch(e){ console.error(e); }
    }; fetchSongs();
  },[userData]);
  const filtered = songs.filter(s=>s.Title.toLowerCase().includes(query.toLowerCase()));
  // For adding song to queue
  const addToQueue = (song, incognito=false)=>{
    const newQueues = [...queues];
    newQueues[currentQueueIndex].songs.push({...song, incognito});
    setQueues(newQueues);
  };
  // Rating handler
  const handleRating = async (song, rating) => {
    try {
      await axios.post(`${BACKEND_URL}/rate`, { User_ID: userData.User_ID, Song_ID: song.Song_ID, Rating: rating });
      setRatings({...ratings, [song.Song_ID]: rating});
      alert('Rating updated!');
    } catch (err) {
      alert('Failed to rate song.');
    }
  };
  return (
    <div style={{ padding:"2rem" }}>
      <button onClick={()=>setView("dashboard")} style={{ marginBottom:"1rem" }}>Back</button>
      <h2>Songs</h2>
      <input placeholder="Search" value={query} onChange={e=>setQuery(e.target.value)} style={{ padding:"0.5rem", marginBottom:"1rem" }} />
      <ul>
        {filtered.map(s=>(
          <li key={s.Song_ID} style={{ marginBottom:"0.5rem" }}>
            {s.Title} ({formatDuration(s.Duration)})
            <button onClick={()=>playSong(s, currentQueueIndex)} style={{ marginLeft:"1rem" }}>Play</button>
            <button onClick={()=>addToQueue(s)} style={{ marginLeft:"0.5rem" }}>Add to Queue</button>
            <button onClick={()=>addToQueue(s,true)} style={{ marginLeft:"0.5rem" }}>Add Incognito</button>
            <span style={{ marginLeft:"1rem" }}>Rate:
              {[1,2,3,4,5].map(r=>
                <button key={r} style={{ marginLeft:"2px",color: ratings[s.Song_ID]===r ? "gold" : undefined}}
                  onClick={()=>handleRating(s,r)}>{r}</button>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ---- Playlists Page ----
const PlaylistsPage = ({ userData, setView }) => {
  // Features: Nested, collaborative, sorting
  const [playlists, setPlaylists] = useState([]); const [selected, setSelected] = useState(null); const [songs, setSongs] = useState([]);
  const [playlistName, setPlaylistName] = useState(""); const [parent, setParent] = useState(""); const [compilers, setCompilers] = useState([]); const [userToAdd, setUserToAdd] = useState("");
  useEffect(()=>{
    const fetchData = async()=>{
      try {
        const res = await axios.get(`${BACKEND_URL}/playlists/user/${userData.User_ID}`);
        setPlaylists(res.data);
      } catch(e){ console.error(e);}
    }; fetchData();
  },[userData]);
  useEffect(()=>{
    if(selected) {
      const fetchSongs = async()=>{
        try{
          const res = await axios.get(`${BACKEND_URL}/playlist-contents/playlist/${selected.Playlist_ID}`); setSongs(res.data);
        }catch(e){ setSongs([]);}
      };
      const fetchCompilers = async()=>{
        try{
          const res = await axios.get(`${BACKEND_URL}/playlist-compile`); // get all
          setCompilers(res.data.filter(row=>row.Playlist_ID===selected.Playlist_ID));
        }catch(e){ setCompilers([]);}
      };
      fetchSongs(); fetchCompilers();
    }
  },[selected]);

  // Creating new playlist
  const createPlaylist = async()=>{
    if(!playlistName) return; 
    try{
      await axios.post(`${BACKEND_URL}/playlists`,{Name:playlistName, Owner_UID:userData.User_ID, Parent_playlist:parent||null});
      alert("Playlist created"); setPlaylistName(""); setParent("");
      // refresh
      const res = await axios.get(`${BACKEND_URL}/playlists/user/${userData.User_ID}`); setPlaylists(res.data);
    }catch(e){ alert("Failed to create");}
  };
  // Add compiler
  const addCompiler = async()=>{
    if(!selected || !userToAdd) return;
    try{
      await axios.post(`${BACKEND_URL}/playlist-compile`,{Playlist_ID:selected.Playlist_ID,User_ID:userToAdd});
      alert("Compiler added"); setUserToAdd("");
      const res = await axios.get(`${BACKEND_URL}/playlist-compile`);
      setCompilers(res.data.filter(row=>row.Playlist_ID===selected.Playlist_ID));
    }catch(e){ alert("Failed");}
  };
  // Remove compiler
  const removeCompiler = async(uid)=>{
    try{
      await axios.delete(`${BACKEND_URL}/playlist-compile`, {data:{Playlist_ID:selected.Playlist_ID,User_ID:uid}});
      alert("Compiler removed");
      setCompilers(compilers.filter(u=>u.User_ID!==uid));
    }catch(e){ alert("Failed");}
  };
  // Sorting
  const moveSong = async(idx,dir)=>{
    if(songs.length<2) return;
    const newSongs = [...songs];
    // Swap
    if(dir==="up"&&(idx>0)){
      [newSongs[idx-1],newSongs[idx]] = [newSongs[idx],newSongs[idx-1]];
    }
    if(dir==="down"&&(idx<songs.length-1)){
      [newSongs[idx+1],newSongs[idx]] = [newSongs[idx],newSongs[idx+1]];
    }
    setSongs(newSongs);
    // Update backend custom_index
    await Promise.all(newSongs.map((s,i)=>
      axios.put(`${BACKEND_URL}/playlist-contents`,{Playlist_ID:selected.Playlist_ID,Song_ID:s.Song_ID,Custom_index:i})
    ));
    alert("Order updated!");
  };
  return (
    <div style={{ padding:"2rem" }}>
      <button onClick={()=>setView("dashboard")} style={{ marginBottom:"1rem" }}>Back</button>
      <h2>Your Playlists</h2>
      <div>
        <input placeholder="New Playlist Name" value={playlistName} onChange={e=>setPlaylistName(e.target.value)} style={{marginRight:"1rem"}} />
        <select value={parent} onChange={e=>setParent(e.target.value)}>
          <option value="">No Parent</option>
          {playlists.map(p=><option key={p.Playlist_ID} value={p.Playlist_ID}>{p.Name}</option>)}
        </select>
        <button onClick={createPlaylist}>Create</button>
      </div>
      <ul>
        {playlists.map(p=>
          <li key={p.Playlist_ID} style={{ cursor:"pointer", fontWeight:selected&&selected.Playlist_ID===p.Playlist_ID?"bold":"normal" }}
            onClick={()=>setSelected(p)}>
            {p.Name} {p.Parent_playlist ? `(Parent: ${p.Parent_playlist})`:null}
          </li>
        )}
      </ul>
      {selected && (
        <div style={{marginTop:"2rem"}}>
          <h3>Edit Playlist: {selected.Name}</h3>
          <h4>Collaborators</h4>
          <ul>
            {compilers.map(u=>
              <li key={u.User_ID}>User {u.User_ID} <button onClick={()=>removeCompiler(u.User_ID)} style={{marginLeft:"0.5rem"}}>Remove</button></li>
            )}
          </ul>
          <input placeholder="User ID to add" value={userToAdd} onChange={e=>setUserToAdd(e.target.value)} style={{marginRight:"1rem"}}/>
          <button onClick={addCompiler}>Add Compiler</button>
          <h4>Songs</h4>
          <ul>
            {songs.map((s,i)=>
              <li key={s.Song_ID}>{s.Title}
                <button style={{marginLeft:"0.5rem"}} onClick={()=>moveSong(i,"up")}>↑</button>
                <button style={{marginLeft:"0.5rem"}} onClick={()=>moveSong(i,"down")}>↓</button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

// ---- Radio Stations ----
const RadioStationsPage = ({ setView }) => {
  const [stations,setStations]=useState([]); const [selected,setSelected]=useState(null); const [songs,setSongs]=useState([]);
  useEffect(()=>{
    const fetchStations = async()=>{
      try{
        const res = await axios.get(`${BACKEND_URL}/radio-stations`);
        setStations(res.data);
      }catch(e){}
    }; fetchStations();
  },[]);
  useEffect(()=>{
    if(selected) {
      const fetchSongs = async()=>{
        try{
          const res = await axios.get(`${BACKEND_URL}/radio-station-contents/station/${selected.Station_ID}`);
          setSongs(res.data);
        }catch(e){setSongs([]);}
      };
      fetchSongs();
    }
  },[selected]);
  return (
    <div style={{padding:"2rem"}}>
      <button onClick={()=>setView("dashboard")} style={{marginBottom:"1rem"}}>Back</button>
      <h2>Radio Stations</h2>
      <ul>
        {stations.map(s=>
          <li key={s.Station_ID} style={{ cursor:"pointer", fontWeight:selected&&selected.Station_ID===s.Station_ID?"bold":"normal" }}
            onClick={()=>setSelected(s)}>
            {s.Name}
          </li>
        )}
      </ul>
      {selected&&(
        <div style={{marginTop:"2rem"}}>
          <h3>Station: {selected.Name}</h3>
          <ul>{songs.map(song=><li key={song.Song_ID}>{song.Title} ({formatDuration(song.Duration)})</li>)}</ul>
        </div>
      )}
    </div>
  );
};

// ---- History Page ----
const HistoryPage = ({ userData, setView }) => {
  const [history,setHistory]=useState([]); 
  useEffect(()=>{
    const fetchHistory = async()=>{
      try{
        const res = await axios.get(`${BACKEND_URL}/history/user/${userData.User_ID}`);
        setHistory(res.data.songs||[]);
      }catch(e){}
    }; fetchHistory();
  },[userData]);
  const clearHistory = async()=>{
    try{
      await axios.delete(`${BACKEND_URL}/history/user/${userData.User_ID}`);
      setHistory([]);
      alert("History cleared!");
    }catch(e){alert("Failed");}
  };
  return (
    <div style={{padding:"2rem"}}>
      <button onClick={()=>setView("dashboard")} style={{marginBottom:"1rem"}}>Back</button>
      <h2>Listening History</h2>
      <button onClick={clearHistory} style={{marginBottom:"1rem"}}>Clear History</button>
      <ul>
        {history.map((h,i)=>
          <li key={i}>{h.Song_Title} ({new Date(h.Timestamp).toLocaleString()})</li>
        )}
      </ul>
    </div>
  );
};

// ---- Artists Page ----
const ArtistsPage = ({ userData, setView }) => {
  // Features: follow/unfollow, list followed artists
  const [artists, setArtists]=useState([]); const [follows,setFollows]=useState([]);
  useEffect(()=>{
    const fetchArtists = async()=>{
      try{
        const res = await axios.get(`${BACKEND_URL}/artists`);
        setArtists(res.data);
        if(userData){
          const res2 = await axios.get(`${BACKEND_URL}/follow/user/${userData.User_ID}`);
          setFollows(res2.data);
        }
      }catch(e){}
    }; fetchArtists();
  },[userData]);
  const followArtist = async(aid)=>{
    try{
      await axios.post(`${BACKEND_URL}/follow`,{User_ID:userData.User_ID,Artist_ID:aid});
      setFollows([...follows, artists.find(a=>a.Artist_ID===aid)]);
    }catch(e){alert("Failed");}
  };
  const unfollowArtist = async(aid)=>{
    try{
      await axios.delete(`${BACKEND_URL}/follow`,{data:{User_ID:userData.User_ID,Artist_ID:aid}});
      setFollows(follows.filter(a=>a.Artist_ID!==aid));
    }catch(e){alert("Failed");}
  };
  return (
    <div style={{padding:"2rem"}}>
      <button onClick={()=>setView("dashboard")} style={{marginBottom:"1rem"}}>Back</button>
      <h2>Artists ({artists.length})</h2>
      <ul>
        {artists.map(a=>{
          const followed = follows.some(f=>f.Artist_ID===a.Artist_ID);
          return <li key={a.Artist_ID}>
            {a.Name} ({a.Country}) 
            {!followed?
              <button style={{marginLeft:"1rem"}} onClick={()=>followArtist(a.Artist_ID)}>Follow</button> :
              <button style={{marginLeft:"1rem"}} onClick={()=>unfollowArtist(a.Artist_ID)}>Unfollow</button>
            }
            <span style={{marginLeft:"0.5rem"}}>Bio: {a.Bio}</span>
          </li>;
        })}
      </ul>
      <h3>Artists you follow:</h3>
      <ul>
        {follows.map(a=><li key={a.Artist_ID}>{a.Name}</li>)}
      </ul>
    </div>
  );
};

// ---- Queues Page ----
const QueuePage = ({ queues, setQueues, currentQueueIndex, setCurrentQueueIndex, setView }) => {
  const [newQueueName, setNewQueueName] = useState("");
  const addQueue = ()=>{
    if(!newQueueName.trim()) return;
    setQueues([...queues, {name:newQueueName, songs:[]}]);
    setNewQueueName("");
  };
  const deleteQueue = (i)=>{
    if(queues.length<=1) return;
    const newQs = [...queues];
    newQs.splice(i,1);
    setQueues(newQs);
    if(currentQueueIndex===i) setCurrentQueueIndex(0);
  };
  return (
    <div style={{ padding:"2rem" }}>
      <button onClick={()=>setView("dashboard")} style={{ marginBottom:"1rem" }}>Back</button>
      <h2>Queues</h2>
      <div style={{ marginBottom:"1rem" }}>
        <input placeholder="New Queue Name" value={newQueueName} onChange={e=>setNewQueueName(e.target.value)} style={{ marginRight:"0.5rem" }} />
        <button onClick={addQueue}>Add Queue</button>
      </div>
      <ul>
        {queues.map((q,i)=>
          <li key={i} style={{ marginBottom:"0.5rem" }}>
            <span style={{ cursor:"pointer", fontWeight: currentQueueIndex===i?"bold":"normal" }} onClick={()=>setCurrentQueueIndex(i)}>{q.name}</span>
            <button onClick={()=>deleteQueue(i)} style={{ marginLeft:"0.5rem" }}>Delete</button>
          </li>
        )}
      </ul>
      <h3>Current Queue: {queues[currentQueueIndex].name}</h3>
      <ul>
        {queues[currentQueueIndex].songs.map((s,i)=><li key={i}>{s.Title}</li>)}
      </ul>
    </div>
  );
};

// ---- Main App ----
const App = () => {
  const [userData,setUserData] = useState(null);
  const [view,setView] = useState("login");
  const [queues,setQueues] = useState([{name:"Default", songs:[]}]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  const [currentSong,setCurrentSong] = useState(null);
  const audioRef = useRef(null);

  useEffect(()=>{
    const stored = localStorage.getItem("userData");
    if(stored){ setUserData(JSON.parse(stored)); setView("dashboard"); }
  },[]);
  useEffect(()=>{
    if(!userData && view!=="login") setView("login");
  }, [userData, view]);
  // --- Song playback/queue/history logic ---
  const stopPlayer = ()=>{
    if(audioRef.current){ audioRef.current.pause(); audioRef.current.currentTime=0; }
    setCurrentSong(null);
  };
  const playSong = async (song, queueIndex=currentQueueIndex)=>{
    // Demo: sound url is static or song.Url if set
    const demoSong = {...song, Url:"/songs/Yiruma-RiverFlowsInYou.mp3"};
    setCurrentSong(demoSong);
    if(audioRef.current){
      audioRef.current.src = demoSong.Url;
      audioRef.current.play();
    }
    // History (unless incognito)
    if(!song.incognito&&userData){
      try { await axios.post(`${BACKEND_URL}/history`, { User_ID:userData.User_ID, Song_ID:song.Song_ID }); }catch(e){}
    }
    // Remove from queue after play and auto-play next
    setQueues(prev=>{
      const newQs = [...prev];
      const q = newQs[queueIndex];
      q.songs = q.songs.filter(s=>s!==song);
      if(q.songs.length>0){
        const next = q.songs[0];
        setTimeout(()=>playSong(next, queueIndex), 0);
      }
      return newQs;
    });
  };

  return (
    <>
      <Navbar userData={userData} setUserData={setUserData} setView={setView} />
      {view==="login" ? <AuthForm setUserData={setUserData} setView={setView} /> :
       view==="dashboard" ? <Dashboard userData={userData} queues={queues} currentQueueIndex={currentQueueIndex} setQueues={setQueues} playSong={playSong} setView={setView} /> :
       view==="songs" ? <SongsPage userData={userData} queues={queues} setQueues={setQueues} currentQueueIndex={currentQueueIndex} playSong={playSong} setView={setView} /> :
       view==="playlists" ? <PlaylistsPage userData={userData} setView={setView} /> :
       view==="radio" ? <RadioStationsPage setView={setView} /> :
       view==="history" ? <HistoryPage userData={userData} setView={setView} /> :
       view==="artists" ? <ArtistsPage userData={userData} setView={setView} /> :
       view==="queues" ? <QueuePage queues={queues} setQueues={setQueues} currentQueueIndex={currentQueueIndex} setCurrentQueueIndex={setCurrentQueueIndex} setView={setView} /> : null
      }
      <PlayerBar currentSong={currentSong} audioRef={audioRef} stopPlayer={stopPlayer} />
    </>
  );
};

export default App;
