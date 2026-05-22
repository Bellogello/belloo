import { useState, useRef, useEffect } from 'react';

// Fallback playlist just in case your JSON doesn't load instantly
const DEFAULT_PLAYLIST = [
  { title: "Loving Machine", artist: "TV Girl", src: "/music/track1.mp3" },
  { title: "No Surprises", artist: "Radiohead", src: "/music/track2.mp3" }
];

export default function MusicPlayer({ playlist = DEFAULT_PLAYLIST }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [idx, setIdx] = useState(0);
  const audioRef = useRef(null);

  // Safely grab the current song
  const safePlaylist = playlist?.length ? playlist : DEFAULT_PLAYLIST;
  const current = safePlaylist[idx];

  // Handle Play/Pause and set default quiet volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.15; // Set volume to 15% (Quiet)
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, idx]);

  if (!current) return null;

  return (
    <div id="np">
      <audio 
        ref={audioRef} 
        src={current.src} 
        onEnded={() => setIdx((i) => (i + 1) % safePlaylist.length)} 
      />
      
      {/* ── THE VINYL ── */}
      <svg 
        className={`vinyl hover-target ${isPlaying ? "spin" : ""}`} 
        onClick={() => setIsPlaying(!isPlaying)} 
        viewBox="0 0 100 100" 
        style={{ cursor: 'none' }} 
      >
        <circle cx="50" cy="50" r="48" fill="#111" stroke="#333" strokeWidth="2" />
        <circle cx="50" cy="50" r="15" fill="#7B5CFA" />
        <circle cx="50" cy="50" r="4" fill="#1a1c1f" />
        <path d="M50 15 A35 35 0 0 1 85 50" stroke="#222" strokeWidth="1" fill="none" />
        <path d="M15 50 A35 35 0 0 0 50 85" stroke="#222" strokeWidth="1" fill="none" />
      </svg>

      {/* ── TRACK INFO & MENU TOGGLE ── */}
      <div 
        className="flex flex-col justify-center hover-target" 
        onClick={() => setShowMenu(!showMenu)}
        style={{ cursor: 'none' }}
      >
        <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest mb-1 flex items-center gap-1">
          Now playing 
          <span className="material-symbols-outlined text-[10px]">{showMenu ? 'expand_more' : 'expand_less'}</span>
        </span>
        <div className="flex items-baseline gap-2">
          <span className="font-body text-sm text-on-surface font-medium leading-none">{current.title}</span>
          <span className="font-body text-xs leading-none" style={{ color: '#7B5CFA' }}>{current.artist}</span>
        </div>
      </div>

      {/* ── EQUALIZER BARS ── */}
      <div className="flex items-end gap-[2px] h-[18px]">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`wb ${isPlaying ? "play" : ""}`}></div>
        ))}
      </div>

      {/* ── PLAYLIST POPUP MENU ── */}
      {showMenu && (
        <div 
          className="absolute left-0 bottom-full mb-4 w-56 bg-[#0f0d18]/95 backdrop-blur-md border border-outline-variant p-2 flex flex-col gap-1 z-50"
          style={{ animation: "fadeIn .2s ease forwards" }}
        >
          <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest px-2 pb-2 mb-1 border-b border-outline-variant">
            Select Track
          </span>
          {safePlaylist.map((song, i) => (
            <button 
              key={i}
              className={`hover-target text-left px-3 py-2 text-xs font-body transition-colors flex justify-between items-center ${idx === i ? 'bg-[#161320] text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}
              onClick={() => {
                setIdx(i);
                setIsPlaying(true);
                setShowMenu(false);
              }}
              style={{ cursor: 'none', border: 'none', background: idx === i ? '#161320' : 'transparent' }}
            >
              <span className="truncate">{song.title}</span>
              <span className="text-[10px]" style={{ color: idx === i ? '#7B5CFA' : '#5a5575' }}>{song.artist}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}