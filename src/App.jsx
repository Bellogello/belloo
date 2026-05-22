import { useState, useEffect, useRef } from 'react';

const DEFAULT_PROJECTS = [
  { id: 1, name: "GlowAroma", status: "live", desc: "Full-stack e-commerce candle shop. Custom configurator, Paymob payments, role-based admin. Deployed on Railway + Vercel.", tags: ["React", "Node.js", "Express", "MariaDB", "Three.js", "Paymob"], url: "https://github.com/Bellogello/Glow-Aroma" },
  { id: 2, name: "Fencing Analyzer", status: "wip", desc: "AI desktop app using pose estimation to analyze fencing technique. Sports obsession meets code obsession.", tags: ["MediaPipe", "FastAPI", "React", "Tauri", "Python"], url: "" },
  { id: 3, name: "Robotics / Electronics", status: "next", desc: "Hardware + software crossover — microcontrollers, sensors, and whatever chaos comes from learning to solder.", tags: ["Arduino", "Embedded C", "Electronics"], url: "" },
];

const DEFAULT_STACK = ["React", "Node.js", "Express", "MariaDB", "Three.js", "Python", "C++", "FastAPI", "PyTorch", "Tauri", "Arch Linux", "Blender", "Git"];
const BADGE = { live: "Live", wip: "In progress", next: "Coming soon" };
const BADGE_COLOR = { live: "#6FD98B", wip: "#cabeff", next: "#6A6080" };

// Headline split for the stagger animation
const HEADLINE_WORDS = "I write code and build systems.".split(" ");

export default function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const cursorRef = useRef(null);
  const spotlightRef = useRef(null);

  // Scroll Listener for Navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for Reveal Elements
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add("visible");
        e.target.querySelectorAll(".hl").forEach((el, i) =>
          setTimeout(() => el.classList.add("lit"), i * 220 + 400)
        );
        observer.unobserve(e.target);
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Custom Cursor and Spotlight Effect
  useEffect(() => {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let cx = mx, cy = my;
    let animationFrameId;

    const handleMouseMove = (e) => {
      mx = e.clientX; 
      my = e.clientY;
      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty("--mx", `${mx}px`);
        spotlightRef.current.style.setProperty("--my", `${my}px`);
      }
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const loop = () => {
      cx = lerp(cx, mx, 0.15); 
      cy = lerp(cy, my, 0.15);
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cx}px,${cy}px,0) translate(-50%,-50%)`;
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    document.addEventListener("mousemove", handleMouseMove);
    animationFrameId = requestAnimationFrame(loop);

    // Hover effect for interactive elements
    const addHover = () => cursorRef.current?.classList.add("big");
    const removeHover = () => cursorRef.current?.classList.remove("big");
    
    document.querySelectorAll(".hover-target, button, a").forEach(el => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div id="cur" ref={cursorRef}></div>
      <div id="spotlight" ref={spotlightRef}></div>

      <nav id="nav" className={`w-full border-b border-outline-variant fixed top-0 left-0 z-50 transition-all duration-300 ${isScrolled ? 'scrolled' : 'bg-transparent'}`}>
        <div className="flex justify-between items-center px-6 md:px-16 py-4 max-w-7xl mx-auto">
          <a href="#" className="font-display text-2xl tracking-tight text-on-surface hover:text-primary transition-colors cursor-pointer hover-target outline-none focus-visible:text-primary">belloo</a>
          <div className="hidden md:flex gap-8">
            <a href="#projects" className="font-mono text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors hover-target outline-none focus-visible:text-primary">Projects</a>
            <a href="#about" className="font-mono text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors hover-target outline-none focus-visible:text-primary">About</a>
            <a href="#contact" className="font-mono text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors hover-target outline-none focus-visible:text-primary">Contact</a>
          </div>
        </div>
      </nav>

      <main className="flex flex-col items-center w-full max-w-7xl mx-auto px-6 md:px-16 pt-24 pb-32">
        {/* HERO */}
        <section className="w-full min-h-[85vh] flex flex-col justify-center border-b border-outline-variant py-24 relative" id="hero">
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-xs text-primary uppercase tracking-widest">Belal Mahmoud</span>
            <span className="w-8 h-px bg-outline-variant"></span>
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">[belloo]</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl text-on-surface leading-tight tracking-tight mb-8 max-w-3xl">
            {HEADLINE_WORDS.map((w, i) => (
              <span key={i} className="hw" style={{ animationDelay: `${i * 0.07}s` }}>{w}&nbsp;</span>
            ))}
          </h1>

          <p className="font-body text-lg text-on-surface-variant mb-12 max-w-xl leading-relaxed">
            Full-stack developer and CS senior. Currently testing software at Kemet Technologies and expanding into AI/ML. I focus on backend architecture, databases, and writing code that executes without the extra noise.
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="https://github.com/Bellogello" target="_blank" rel="noreferrer" className="btn-primary px-8 py-4 font-mono text-xs uppercase tracking-widest hover-target outline-none">
              GitHub ↗
            </a>
            <a href="#projects" className="btn-secondary px-8 py-4 font-mono text-xs uppercase tracking-widest flex items-center gap-2 hover-target outline-none">
              <span className="material-symbols-outlined text-lg" style={{ color: '#FFB347' }}>arrow_forward</span>
              See Projects
            </a>
          </div>
        </section>

        {/* PROJECTS */}
        <section className="w-full py-24 border-b border-outline-variant reveal" id="projects">
          <h2 className="font-display text-3xl text-on-surface mb-16 flex items-center gap-4">
            <span className="w-10 h-px bg-outline-variant"></span> Selected works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DEFAULT_PROJECTS.map(p => (
              <div 
                key={p.id} 
                className={`card p-8 flex flex-col ${p.url ? 'cursor-pointer hover-target' : ''}`}
                onClick={() => p.url && window.open(p.url, '_blank')}
                tabIndex={p.url ? "0" : "-1"}
              >
                <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full pulse-dot" style={{ color: BADGE_COLOR[p.status], background: BADGE_COLOR[p.status] }}></span>
                    <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: BADGE_COLOR[p.status] }}>{BADGE[p.status]}</span>
                  </div>
                  {p.url && <span className="material-symbols-outlined text-on-surface-variant card-arrow text-base">arrow_outward</span>}
                </div>
                <h3 className="font-display text-2xl text-on-surface mb-3">{p.name}</h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-6 flex-grow">{p.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map(t => (
                    <span key={t} className="chip px-3 py-1 border border-outline-variant font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section className="w-full py-24 border-b border-outline-variant reveal grid grid-cols-1 md:grid-cols-12 gap-12" id="about">
          <div className="md:col-span-4">
            <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-widest border-b border-outline-variant pb-4 mb-6">Core stack</h3>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_STACK.map(s => (
                <span key={s} className="chip px-4 py-2 border border-outline-variant font-mono text-xs text-on-surface uppercase tracking-wider cursor-default">{s}</span>
              ))}
            </div>
          </div>
          <div className="md:col-span-8">
            <h2 className="font-display text-3xl text-on-surface mb-6">Behind the commits.</h2>
            <div className="space-y-5 text-on-surface-variant leading-relaxed">
              <p>I'm Belal, a 19-year-old 4th-year CS student in Egypt.</p>
              <p>My focus is on backend architecture, databases, and competitive programming. When I'm not shipping full-stack code, my time goes into training on the fencing piste, working on 3D visualization in Blender, or obsessing over 90s JDM cars.</p>
              <p>I believe in zero-bloat architecture, raw performance, and building tools from scratch until they run perfectly. That's the whole pitch.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-outline-variant">
        <div className="flex justify-between items-center py-8 px-6 md:px-16 max-w-7xl mx-auto">
          <span className="font-display text-2xl tracking-tight">belloo</span>
          <span className="font-mono text-xs uppercase tracking-widest text-on-surface-variant cursor-default">
            Built lean.
          </span>
        </div>
      </footer>

      {/* NOW PLAYING */}
      <div id="np">
        <svg 
          className={`vinyl ${isPlaying ? "spin" : ""}`} 
          onClick={() => setIsPlaying(!isPlaying)} 
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsPlaying(!isPlaying)}
          viewBox="0 0 100 100" 
          style={{ cursor: 'pointer' }} 
          tabIndex="0" 
          role="button" 
          aria-label="Toggle music"
        >
          <circle cx="50" cy="50" r="48" fill="#111" stroke="#333" strokeWidth="2" />
          <circle cx="50" cy="50" r="15" fill="#7B5CFA" />
          <circle cx="50" cy="50" r="4" fill="#1a1c1f" />
          <path d="M50 15 A35 35 0 0 1 85 50" stroke="#222" strokeWidth="1" fill="none" />
          <path d="M15 50 A35 35 0 0 0 50 85" stroke="#222" strokeWidth="1" fill="none" />
        </svg>
        <div className="flex flex-col justify-center">
          <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest mb-1">Now playing</span>
          <div className="flex items-baseline gap-2">
            <span className="font-body text-sm text-on-surface font-medium leading-none">Loving Machine</span>
            <span className="font-body text-xs leading-none" style={{ color: '#7B5CFA' }}>TV Girl</span>
          </div>
        </div>
        <div className="flex items-end gap-[2px] h-[18px]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`wb ${isPlaying ? "play" : ""}`}></div>
          ))}
        </div>
      </div>
    </>
  );
}