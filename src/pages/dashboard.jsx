import { useState, useEffect } from "react";

// ── CONSTANTS ────────────────────────────────────────────────────
const BADGE       = { live: "Live", wip: "In Progress", next: "Coming Soon" };
const BADGE_COLOR = { live: "#6FD98B", wip: "#cabeff", next: "#5a5575" };

// ── API HELPERS ──────────────────────────────────────────────────
async function apiFetch(url, opts = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Automatically grab the password from session storage to authorize the local save
const apiPost = (type, data) => {
  const pw = sessionStorage.getItem("dash_pass");
  return apiFetch("/api/savedata", { 
    method: "POST", 
    body: JSON.stringify({ type, data, password: pw }) 
  });
};

// ── PASSWORD GATE ────────────────────────────────────────────────
function PasswordGate({ onUnlock }) {
  const [pw, setPw]     = useState("");
  const [err, setErr]   = useState(false);
  const PASS            = import.meta.env.VITE_DASHBOARD_PASS || "belloo2025";

  function attempt() {
    if (pw === PASS) {
      // Save the actual password so the API can use it
      sessionStorage.setItem("dash_pass", pw);
      onUnlock();
    } else {
      setErr(true);
      setTimeout(() => setErr(false), 1400);
    }
  }

  return (
    <div style={styles.gateWrap}>
      <div style={styles.gateBox}>
        <div style={styles.gateLogo}>belloo</div>
        <p style={styles.gateLabel}>DASHBOARD ACCESS</p>
        <input
          style={{ ...styles.inp, ...(err ? styles.inpErr : {}) }}
          type="password"
          placeholder="enter password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === "Enter" && attempt()}
          autoFocus
        />
        {err && <p style={styles.errMsg}>incorrect password</p>}
        <button style={styles.btn} onClick={attempt}>Unlock</button>
      </div>
    </div>
  );
}

// ── TOAST ────────────────────────────────────────────────────────
function Toast({ msg, err }) {
  return msg ? (
    <div style={{ ...styles.toast, ...(err ? styles.toastErr : {}) }}>{msg}</div>
  ) : null;
}

// ── SYNC BADGE ───────────────────────────────────────────────────
function SyncBadge({ state }) {
  const color = state === "ok" ? "#6FD98B" : state === "loading" ? "#FFB347" : "#FF6B6B";
  const label = state === "ok" ? "SYNCED" : state === "loading" ? "SYNCING..." : "ERROR";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: color,
        animation: state === "ok" ? "pulse 2s infinite" : "none" }} />
      <span style={{ fontSize: ".55rem", color: "#5a5575", letterSpacing: ".08em" }}>{label}</span>
    </div>
  );
}

// ── PROJECTS TAB ─────────────────────────────────────────────────
function ProjectsTab({ projects, setProjects, toast }) {
  const [form, setForm] = useState({ name:"", desc:"", status:"wip", tags:"", liveUrl:"", repoUrl:"" });
  const [editingId, setEditingId] = useState(null);

  async function toggleFeature(p) {
    const isFeatured = p.featured;
    if (!isFeatured && projects.filter(x => x.featured).length >= 4) {
      toast("Maximum 4 projects allowed on Home", true);
      return;
    }
    const updated = { ...p, featured: !isFeatured };
    try {
      await apiPost("project_update", updated);
      setProjects(prev => prev.map(x => String(x.id) === String(p.id) ? updated : x));
      toast(isFeatured ? "Removed from Home" : "✓ Pinned to Home");
    } catch { toast("Failed to update", true); }
  }

  async function saveProject() {
    if (!form.name.trim() || !form.desc.trim()) { toast("Name and description required", true); return; }
    const proj = { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) };
    
    try {
      if (editingId) {
        const existing = projects.find(x => String(x.id) === String(editingId));
        const finalProj = { ...proj, featured: existing?.featured || false, id: editingId };
        await apiPost("project_update", finalProj);
        setProjects(prev => prev.map(p => String(p.id) === String(editingId) ? finalProj : p));
        toast("✓ Project updated");
      } else {
        const newId = Date.now().toString();
        await apiPost("project_add", proj);
        setProjects(prev => [...prev, { ...proj, id: newId }]);
        toast("✓ Project added");
      }
      setForm({ name:"", desc:"", status:"wip", tags:"", liveUrl:"", repoUrl:"" });
      setEditingId(null);
    } catch { toast("Failed to save", true); }
  }

  function editProject(p) {
    setEditingId(p.id);
    setForm({
      name: p.name || "", desc: p.desc || "", status: p.status || "wip",
      tags: p.tags ? p.tags.join(", ") : "", 
      liveUrl: p.liveUrl || p.url || "", // Support legacy url
      repoUrl: p.repoUrl || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ name:"", desc:"", status:"wip", tags:"", liveUrl:"", repoUrl:"" });
  }

  async function remove(id) {
    if (!confirm("Delete this project?")) return;
    try {
      await apiPost("project_delete", { id });
      setProjects(prev => prev.filter(p => String(p.id) !== String(id)));
      if (editingId === id) cancelEdit();
      toast("✓ Deleted");
    } catch { toast("Failed to delete", true); }
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
      <div style={styles.panel}>
        <div style={styles.panelTitle}>{editingId ? "Edit project" : "Add project"}</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".6rem", marginBottom:".6rem" }}>
          <div>
            <label style={styles.label}>Name</label>
            <input style={styles.inp} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="GlowAroma" />
          </div>
          <div>
            <label style={styles.label}>Status</label>
            <select style={styles.inp} value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
              <option value="live">Live</option>
              <option value="wip">In Progress</option>
              <option value="next">Coming Soon</option>
            </select>
          </div>
        </div>
        <div style={{ marginBottom:".6rem" }}>
          <label style={styles.label}>Description</label>
          <textarea style={{...styles.inp, minHeight:60, resize:"vertical"}} value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} placeholder="What does it do?" />
        </div>
        <div style={{ marginBottom:".8rem" }}>
          <label style={styles.label}>Tech tags (comma separated)</label>
          <input style={styles.inp} value={form.tags} onChange={e=>setForm(f=>({...f,tags:e.target.value}))} placeholder="React, Node.js" />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".6rem", marginBottom:".8rem" }}>
          <div>
            <label style={styles.label}>Live Website URL (optional)</label>
            <input style={styles.inp} value={form.liveUrl} onChange={e=>setForm(f=>({...f,liveUrl:e.target.value}))} placeholder="https://..." />
          </div>
          <div>
            <label style={styles.label}>GitHub Repo URL (optional)</label>
            <input style={styles.inp} value={form.repoUrl} onChange={e=>setForm(f=>({...f,repoUrl:e.target.value}))} placeholder="https://github.com/..." />
          </div>
        </div>
        
        <div style={{ display: "flex", gap: ".6rem" }}>
          <button style={{...styles.btn, flex: 1}} onClick={saveProject}>
            {editingId ? "Update Project" : "+ Add Project"}
          </button>
          {editingId && (
            <button style={styles.btnOutline} onClick={cancelEdit}>Cancel</button>
          )}
        </div>
      </div>

      <div style={styles.panel}>
        <div style={{...styles.panelTitle, display:"flex", justifyContent:"space-between"}}>
          <span>Current projects</span>
          <span style={{color:"#5a5575", textTransform:"none"}}>Star up to 4 for Home</span>
        </div>
        {!projects.length
          ? <p style={{ fontSize:".65rem", color:"#5a5575" }}>No projects yet.</p>
          : projects.map(p => (
            <div key={String(p.id)} style={{...styles.projRow, borderColor: editingId === p.id ? "#7B5CFA" : "#2d2a42"}}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:".78rem", color:"#eae6ff", marginBottom:".2rem", display:"flex", alignItems:"center", gap:".4rem" }}>
                  {p.name}
                  {p.featured && <span style={{ fontSize:".45rem", background:"#FFB347", color:"#0f0d18", padding:"2px 5px", borderRadius:2, fontWeight:"bold" }}>HOME</span>}
                </div>
                <div style={{ fontSize:".58rem", color: BADGE_COLOR[p.status]||"#5a5575", marginBottom:".25rem" }}>{BADGE[p.status]||p.status}</div>
                <div style={{ fontSize:".58rem", color:"#5a5575", display:"flex", gap:".5rem" }}>
                  {p.liveUrl && <span>🌐 Live</span>}
                  {p.repoUrl && <span>💻 Repo</span>}
                </div>
              </div>
              <div style={{ display: "flex", gap: ".3rem", alignItems: "flex-start" }}>
                <button style={{...styles.btnGhost, marginLeft: 0, color: p.featured ? "#FFB347" : "#5a5575"}} onClick={()=>toggleFeature(p)}>
                  <span className="material-symbols-outlined" style={{ fontSize:16, fontVariationSettings: p.featured ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                </button>
                <button style={{...styles.btnGhost, marginLeft: 0}} onClick={()=>editProject(p)}>
                  <span className="material-symbols-outlined" style={{ fontSize:15 }}>edit</span>
                </button>
                <button style={{...styles.btnGhost, marginLeft: 0}} onClick={()=>remove(String(p.id || p._id))}>
                  <span className="material-symbols-outlined" style={{ fontSize:15 }}>delete</span>
                </button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
// ── STACK TAB ────────────────────────────────────────────────────
function StackTab({ stack, setStack, toast }) {
  const [val, setVal] = useState("");

  async function add() {
    if (!val.trim() || stack.includes(val.trim())) return;
    const next = [...stack, val.trim()];
    setStack(next);
    setVal("");
    await save(next);
  }

  async function remove(i) {
    const next = stack.filter((_,idx)=>idx!==i);
    setStack(next);
    await save(next);
  }

  async function save(s) {
    try { await apiPost("stack", { stack: s }); toast("✓ Stack saved"); }
    catch { toast("Failed to save stack", true); }
  }

  return (
    <div style={styles.panel}>
      <div style={styles.panelTitle}>Stack technologies</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:".3rem", marginBottom:".8rem", minHeight:40 }}>
        {stack.map((s,i) => (
          <div key={i} style={styles.chip}>
            <span style={{ fontSize:".6rem", color:"#9b96b8" }}>{s}</span>
            <button style={styles.chipDel} onClick={()=>remove(i)}>×</button>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:".5rem" }}>
        <input style={{...styles.inp, flex:1}} value={val} onChange={e=>setVal(e.target.value)}
          placeholder="Add technology..." onKeyDown={e=>e.key==="Enter"&&add()} />
        <button style={styles.btnOutline} onClick={add}>Add</button>
      </div>
    </div>
  );
}

// ── BIO TAB ──────────────────────────────────────────────────────
function BioTab({ config, setConfig, toast }) {
  const [form, setForm] = useState({
    statusText: config.statusText || "",
    roleText:   config.roleText   || "",
    bioPara:    config.bioPara    || "",
  });

  useEffect(() => {
    setForm({ statusText: config.statusText||"", roleText: config.roleText||"", bioPara: config.bioPara||"" });
  }, [config]);

  async function save() {
    try {
      await apiPost("config", form);
      setConfig(c => ({ ...c, ...form }));
      toast("✓ Bio saved");
    } catch { toast("Failed to save bio", true); }
  }

  return (
    <div style={styles.panel}>
      <div style={styles.panelTitle}>Hero content</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".6rem", marginBottom:".6rem" }}>
        <div>
          <label style={styles.label}>Status pill</label>
          <input style={styles.inp} value={form.statusText} onChange={e=>setForm(f=>({...f,statusText:e.target.value}))} placeholder="Open to opportunities" />
        </div>
        <div>
          <label style={styles.label}>Role line</label>
          <input style={styles.inp} value={form.roleText} onChange={e=>setForm(f=>({...f,roleText:e.target.value}))} placeholder="Full-stack dev · AI/ML incoming" />
        </div>
      </div>
      <div style={{ marginBottom:".8rem" }}>
        <label style={styles.label}>Bio paragraph</label>
        <textarea style={{...styles.inp, minHeight:80, resize:"vertical"}} value={form.bioPara} onChange={e=>setForm(f=>({...f,bioPara:e.target.value}))} />
      </div>
      <button style={{...styles.btn, width:"100%"}} onClick={save}>Save Bio</button>
    </div>
  );
}

// ── NOW PLAYING TAB ──────────────────────────────────────────────
function NowPlayingTab({ config, setConfig, toast }) {
  const [song,   setSong]   = useState(config.nowPlaying?.song   || "");
  const [artist, setArtist] = useState(config.nowPlaying?.artist || "");
  const [saved,  setSaved]  = useState(false);

  useEffect(() => {
    setSong(config.nowPlaying?.song   || "");
    setArtist(config.nowPlaying?.artist || "");
  }, [config]);

  async function save() {
    if (!song.trim() || !artist.trim()) { toast("Song and artist required", true); return; }
    try {
      await apiPost("nowplaying", { song, artist, playing: true });
      setConfig(c => ({ ...c, nowPlaying: { song, artist, playing: true } }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch { toast("Failed to save", true); }
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <div style={styles.panel}>
        <div style={styles.panelTitle}>Add To Playlist</div>

        {/* Live preview */}
        <div style={styles.npPreview}>
          <div style={styles.npVinyl}><div style={styles.npVinylInner} /></div>
          <div>
            <div style={{ fontSize:".5rem", color:"#9b96b8", letterSpacing:".1em", textTransform:"uppercase", marginBottom:".15rem" }}>up next</div>
            <div style={{ display:"flex", alignItems:"baseline", gap:".4rem" }}>
              <span style={{ fontSize:".75rem", color:"#eae6ff" }}>{song  || "—"}</span>
              <span style={{ fontSize:".62rem", color:"#7B5CFA" }}>{artist|| "—"}</span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom:".6rem" }}>
          <label style={styles.label}>Song title</label>
          <input style={styles.inp} value={song} onChange={e=>setSong(e.target.value)} placeholder="e.g. Loving Machine" />
        </div>
        <div style={{ marginBottom:".8rem" }}>
          <label style={styles.label}>Artist name</label>
          <input style={styles.inp} value={artist} onChange={e=>setArtist(e.target.value)} placeholder="e.g. TV Girl" />
        </div>
        <button
          style={{ ...styles.btn, width:"100%", ...(saved ? styles.btnSuccess : {}) }}
          onClick={save}
        >
          {saved ? "✓ Saved to JSON" : "Push to Playlist"}
        </button>
      </div>
    </div>
  );
}

// ── MAIN DASHBOARD ───────────────────────────────────────────────
export default function Dashboard() {
  // Check for the exact password string instead of a boolean
  const [authed,   setAuthed]   = useState(!!sessionStorage.getItem("dash_pass"));
  const [tab,      setTab]      = useState("projects");
  const [projects, setProjects] = useState([]);
  const [stack,    setStack]    = useState([]);
  const [config,   setConfig]   = useState({});
  const [sync,     setSync]     = useState("loading");
  const [toastMsg, setToastMsg] = useState(null);

  function showToast(msg, err=false) {
    setToastMsg({ msg, err });
    setTimeout(() => setToastMsg(null), 2300);
  }

  async function loadAll() {
    setSync("loading");
    try {
      const d = await apiFetch("/api/getdata");
      // Map the local JSON structure
      setConfig(d.bio || {});
      setProjects(d.projects || []);
      setStack(d.stack || []);
      
      // Pull the most recent song from the playlist array
      if (d.playlist && d.playlist.length > 0) {
        setConfig(prev => ({ 
          ...prev, 
          nowPlaying: { song: d.playlist[0].title, artist: d.playlist[0].artist } 
        }));
      }
      
      setSync("ok");
    } catch {
      setSync("err");
      showToast("Could not load local JSON", true);
    }
  }

  useEffect(() => { if (authed) loadAll(); }, [authed]);

  if (!authed) return <PasswordGate onUnlock={() => setAuthed(true)} />;

  const TABS = [
    { id:"projects",   icon:"folder_open", label:"Projects"    },
    { id:"stack",      icon:"layers",      label:"Stack"       },
    { id:"bio",        icon:"person",      label:"Bio"         },
    { id:"nowplaying", icon:"music_note",  label:"Now Playing" },
  ];

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #0f0d18; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0f0d18; }
        ::-webkit-scrollbar-thumb { background: #2d2a42; border-radius: 2px; }
      `}</style>

      {toastMsg && <Toast msg={toastMsg.msg} err={toastMsg.err} />}

      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.sideTop}>
          <div style={styles.logo}>belloo</div>
          <div style={styles.sideUser}>
            <div style={styles.avatar}>B.M</div>
            <div>
              <div style={{ fontSize:".65rem", color:"#eae6ff", letterSpacing:".04em" }}>B.MAHMOUD</div>
              <div style={{ fontSize:".55rem", color:"#FFB347", marginTop:".1rem" }}>[DASHBOARD]</div>
            </div>
          </div>
        </div>

        <nav style={{ padding:".75rem .5rem", flex:1 }}>
          {TABS.map(t => (
            <a key={t.id} href="#" style={{
              ...styles.navItem,
              ...(tab===t.id ? styles.navItemActive : {})
            }} onClick={e=>{ e.preventDefault(); setTab(t.id); }}>
              <span className="material-symbols-outlined" style={{ fontSize:16 }}>{t.icon}</span>
              {t.label}
            </a>
          ))}
        </nav>

        <div style={styles.sideBottom}>
          <SyncBadge state={sync} />
          <div style={{ display:"flex", gap:".6rem", marginTop:".6rem" }}>
            <button style={styles.btnOutline} onClick={loadAll}>Refresh</button>
            <a href="/" style={{ ...styles.btnOutline, textDecoration:"none", display:"inline-flex", alignItems:"center", gap:".3rem" }}>
              <span className="material-symbols-outlined" style={{ fontSize:13 }}>arrow_back</span>Portfolio
            </a>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={styles.main}>
        <div style={styles.mainHeader}>
          <div>
            <h1 style={styles.mainTitle}>Dashboard</h1>
            <p style={{ fontSize:".6rem", color:"#5a5575", letterSpacing:".08em", margin:0 }}>
              All changes save directly to the local content.json file.
            </p>
          </div>
        </div>

        {tab === "projects"   && <ProjectsTab   projects={projects} setProjects={setProjects} toast={showToast} />}
        {tab === "stack"      && <StackTab       stack={stack}       setStack={setStack}       toast={showToast} />}
        {tab === "bio"        && <BioTab         config={config}     setConfig={setConfig}     toast={showToast} />}
        {tab === "nowplaying" && <NowPlayingTab  config={config}     setConfig={setConfig}     toast={showToast} />}
      </main>
    </div>
  );
}

// ── STYLES ───────────────────────────────────────────────────────
const styles = {
  root:        { display:"flex", minHeight:"100vh", fontFamily:"'JetBrains Mono',monospace", background:"#0f0d18", color:"#eae6ff" },
  sidebar:     { width:220, flexShrink:0, background:"#0f0d18", borderRight:"1px solid #2d2a42", display:"flex", flexDirection:"column", height:"100vh", position:"sticky", top:0 },
  sideTop:     { padding:"1.1rem 1rem .9rem", borderBottom:"1px solid #2d2a42" },
  logo:        { fontFamily:"'Libre Caslon Text',serif", fontSize:"1.35rem", color:"#7B5CFA", fontStyle:"italic", marginBottom:".7rem" },
  sideUser:    { display:"flex", alignItems:"center", gap:".6rem" },
  avatar:      { width:30, height:30, background:"#1e1b2e", border:"1px solid #2d2a42", display:"flex", alignItems:"center", justifyContent:"center", fontSize:".55rem", color:"#5a5575", flexShrink:0 },
  navItem:     { display:"flex", alignItems:"center", gap:10, padding:".45rem .75rem", fontSize:".62rem", letterSpacing:".1em", textTransform:"uppercase", color:"#5a5575", borderLeft:"2px solid transparent", cursor:"pointer", transition:"all .15s", textDecoration:"none" },
  navItemActive:{ color:"#cabeff", borderLeftColor:"#7B5CFA", background:"#161320" },
  sideBottom:  { padding:".75rem 1rem", borderTop:"1px solid #2d2a42" },
  main:        { flex:1, padding:"1.5rem 2rem", overflowY:"auto", maxWidth:860 },
  mainHeader:  { display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #2d2a42", paddingBottom:"1rem", marginBottom:"1.5rem" },
  mainTitle:   { fontFamily:"'Libre Caslon Text',serif", fontSize:"1.5rem", color:"#eae6ff", margin:0, marginBottom:".2rem" },
  panel:       { background:"#161320", border:"1px solid #2d2a42", padding:"1.1rem", marginBottom:0 },
  panelTitle:  { fontSize:".62rem", letterSpacing:".12em", textTransform:"uppercase", color:"#7B5CFA", borderBottom:"1px solid #2d2a42", paddingBottom:".5rem", marginBottom:".9rem" },
  label:       { display:"block", fontSize:".56rem", letterSpacing:".1em", textTransform:"uppercase", color:"#5a5575", marginBottom:".28rem" },
  inp:         { background:"#0f0d18", border:"1px solid #2d2a42", color:"#eae6ff", fontFamily:"'JetBrains Mono',monospace", fontSize:".7rem", padding:".42rem .55rem", width:"100%", outline:"none", transition:"border-color .15s" },
  inpErr:      { borderColor:"#FF6B6B" },
  btn:         { fontFamily:"'JetBrains Mono',monospace", fontSize:".6rem", letterSpacing:".1em", textTransform:"uppercase", padding:".45rem 1rem", border:"1px solid #7B5CFA", background:"#7B5CFA", color:"#fff", cursor:"pointer", transition:"all .15s" },
  btnOutline:  { fontFamily:"'JetBrains Mono',monospace", fontSize:".58rem", letterSpacing:".1em", textTransform:"uppercase", padding:".35rem .7rem", border:"1px solid #2d2a42", background:"transparent", color:"#5a5575", cursor:"pointer", transition:"all .15s" },
  btnGhost:    { fontFamily:"'JetBrains Mono',monospace", fontSize:".6rem", padding:".3rem .55rem", border:"1px solid #2d2a42", background:"transparent", color:"#5a5575", cursor:"pointer", transition:"all .15s", marginLeft:".75rem", flexShrink:0 },
  btnSuccess:  { background:"#3a6040", borderColor:"#6FD98B", color:"#6FD98B" },
  projRow:     { display:"flex", justifyContent:"space-between", alignItems:"flex-start", background:"#0f0d18", border:"1px solid #2d2a42", padding:".65rem .85rem", marginBottom:".4rem" },
  chip:        { display:"inline-flex", alignItems:"center", gap:".3rem", background:"#0f0d18", border:"1px solid #2d2a42", padding:".18rem .5rem .18rem .6rem", margin:".12rem" },
  chipDel:     { background:"none", border:"none", color:"#5a5575", cursor:"pointer", fontSize:".75rem", lineHeight:1, padding:"0 .1rem" },
  toast:       { position:"fixed", bottom:"1.5rem", right:"1.5rem", background:"#1e1b2e", border:"1px solid #3d3960", color:"#cabeff", fontSize:".62rem", letterSpacing:".08em", padding:".5rem 1.2rem", zIndex:9998 },
  toastErr:    { borderColor:"#FF6B6B", color:"#FF6B6B" },
  npPreview:   { display:"flex", alignItems:"center", gap:".8rem", background:"#0f0d18", border:"1px solid #7B5CFA", borderRadius:9999, padding:".45rem 1rem .45rem .55rem", marginBottom:"1.1rem", width:"fit-content" },
  npVinyl:     { width:26, height:26, borderRadius:"50%", border:"1px solid #3d3960", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  npVinylInner:{ width:8, height:8, borderRadius:"50%", background:"#7B5CFA", opacity:.8 },
  gateWrap:    { display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", background:"#0f0d18" },
  gateBox:     { background:"#161320", border:"1px solid #2d2a42", padding:"2rem", width:300, display:"flex", flexDirection:"column", gap:".7rem" },
  gateLogo:    { fontFamily:"'Libre Caslon Text',serif", fontSize:"1.4rem", color:"#7B5CFA", fontStyle:"italic", textAlign:"center" },
  gateLabel:   { fontSize:".58rem", color:"#5a5575", letterSpacing:".12em", textAlign:"center", margin:0 },
  errMsg:      { fontSize:".58rem", color:"#FF6B6B", letterSpacing:".06em", margin:0 },
};