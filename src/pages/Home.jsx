import { useState, useEffect } from 'react';

// ── CONSTANTS ────────────────────────────────────────────────────
const HEADLINE_WORDS  = "Code, architecture, and raw performance.".split(" ");
const BADGE           = { live: "Live", wip: "In progress", next: "Coming soon" };
const BADGE_COLOR     = { live: "#6FD98B", wip: "#cabeff", next: "#6A6080" };

// ── ICONS ────────────────────────────────────────────────────────
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

// ── SKELETON ─────────────────────────────────────────────────────
function Skeleton({ w = "100%", h = 28 }) {
  return <div className="skel" style={{ width: w, height: h, borderRadius: 0 }} />;
}

export default function Home({ data }) {
    const navigate = (e, path) => {
    e.preventDefault();
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
  
  const { bio, stack, projects } = data || {};
  const loading = !data; 
  
  
  // ── UI STATE ───────────────────────────────────────────────────
  const [choiceId, setChoiceId] = useState(null);

  // Grab featured projects first. Fallback to first 4.
  let homeProjects = projects ? projects.filter(p => p.featured) : [];
  if (homeProjects.length === 0 && projects) homeProjects = projects.slice(0, 4);
  else if (homeProjects.length > 0) homeProjects = homeProjects.slice(0, 4);

  // ── CLICK HANDLER ──────────────────────────────────────────────
  const handleCardClick = (e, p) => {
    if (e.target.closest('.choice-btn')) return;

    const hasLive = !!(p.liveUrl || p.url);
    const hasRepo = !!p.repoUrl;

    if (hasLive && hasRepo) {
      setChoiceId(choiceId === p.id ? null : String(p.id || p._id));
    } else if (hasLive) {
      window.open(p.liveUrl || p.url, "_blank");
    } else if (hasRepo) {
      window.open(p.repoUrl, "_blank");
    }
  };

  // ── REVEAL OBSERVER ────────────────────────────────────────────
  useEffect(() => {
    if (loading) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add("visible");
        e.target.querySelectorAll(".hl").forEach((el, i) =>
          setTimeout(() => el.classList.add("lit"), i * 220 + 400)
        );
        obs.unobserve(e.target);
      });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [loading]);

  return (
    <>
      {/* HERO */}
      <section className="w-full min-h-[85vh] flex flex-col justify-center border-b border-outline-variant py-24 relative" id="hero">
        <div className="flex items-center gap-4 mb-8">
          <span className="font-mono text-xs text-primary uppercase tracking-widest">{bio?.statusText || "Belal Mahmoud"}</span>
          <span className="w-8 h-px bg-outline-variant" />
          <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">{bio?.roleText || "[belloo]"}</span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl text-on-surface leading-tight tracking-tight mb-8 max-w-3xl">
          {HEADLINE_WORDS.map((w, i) => (
            <span key={i} className="hw" style={{ animationDelay: `${i * .07}s` }}>{w}&nbsp;</span>
          ))}
        </h1>

        <p className="font-body text-lg text-on-surface-variant mb-12 max-w-xl leading-relaxed">
          {bio?.bioPara || "Full-stack developer. AI/ML incoming. Building things that didn't exist before — web apps, intelligent systems, and soon, hardware."}
        </p>

        <div className="flex flex-wrap gap-4">
          <a href="/resume.pdf" target="_blank" rel="noreferrer"
            className="btn-primary px-8 py-4 font-mono text-xs uppercase tracking-widest hover-target outline-none">
            Resume ↗
          </a>
          <a href="https://github.com/Bellogello" target="_blank" rel="noreferrer"
            className="btn-secondary px-8 py-4 font-mono text-xs uppercase tracking-widest flex items-center gap-2 hover-target outline-none">
            GitHub
          </a>
          <a href="/projects" onClick={(e) => navigate(e, "/projects")}
            className="btn-secondary px-8 py-4 font-mono text-xs uppercase tracking-widest flex items-center gap-2 hover-target outline-none">
            <span className="material-symbols-outlined text-lg" style={{ color:"#FFB347" }}>arrow_forward</span>
            Projects
          </a>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="w-full py-24 border-b border-outline-variant reveal" id="projects">
        <h2 className="font-display text-3xl text-on-surface mb-16 flex items-center gap-4">
          <span className="w-10 h-px bg-outline-variant" /> Selected works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading
            ? [0, 1].map(i => <div key={i} className="card p-8 h-52 skel" />)
            : homeProjects.map(p => {
                const hasLive = !!(p.liveUrl || p.url);
                const hasRepo = !!p.repoUrl;
                const isClickable = hasLive || hasRepo;

                return (
                  <div
                    key={String(p._id || p.id)}
                    className={`card p-8 flex flex-col relative overflow-hidden ${isClickable ? "cursor-pointer hover-target" : ""}`}
                    onClick={(e) => isClickable && handleCardClick(e, p)}
                    tabIndex={isClickable ? 0 : -1}
                  >
                    {/* OVERLAY MENU */}
                    {choiceId === String(p.id || p._id) && (
                      <div className="absolute inset-0 bg-[#0f0d18]/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-6 animate-fade-in" style={{ animation: "fadeIn .2s ease forwards" }}>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Select Destination</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <a href={p.liveUrl || p.url} target="_blank" className="choice-btn px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-[#0f0d18] transition-colors font-mono text-xs uppercase tracking-widest flex items-center gap-3">
                            <span className="material-symbols-outlined text-[18px]">language</span> Live Site
                          </a>
                          <a href={p.repoUrl} target="_blank" className="choice-btn px-6 py-3 border border-outline-variant text-on-surface hover:border-on-surface transition-colors font-mono text-xs uppercase tracking-widest flex items-center gap-3">
                            <GitHubIcon /> Repository
                          </a>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setChoiceId(null); }} className="choice-btn absolute top-6 right-6 text-on-surface-variant hover:text-primary outline-none">
                          <span className="material-symbols-outlined">close</span>
                        </button>
                      </div>
                    )}

                    {/* CARD CONTENT */}
                    <div className="flex justify-between items-start mb-10">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full pulse-dot" style={{ color: BADGE_COLOR[p.status] || "#6A6080", background: BADGE_COLOR[p.status] || "#6A6080" }} />
                        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: BADGE_COLOR[p.status] || "#6A6080" }}>{BADGE[p.status] || p.status}</span>
                      </div>
                      
                      {/* Top Right Icons */}
                      <div className="flex gap-3 text-on-surface-variant opacity-60">
                        {hasRepo && <GitHubIcon />}
                        {hasLive && <span className="material-symbols-outlined text-[18px]">language</span>}
                      </div>
                    </div>

                    <h3 className="font-display text-2xl text-on-surface mb-3">{p.name}</h3>
                    <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-6 flex-grow">{p.desc}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {(p.tags || []).map(t => (
                        <span key={t} className="chip px-3 py-1 border border-outline-variant font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">{t}</span>
                      ))}
                    </div>
                  </div>
                );
              })
          }
        </div>
      </section>

      {/* STACK + ABOUT */}
      <section className="w-full py-24 reveal grid grid-cols-1 md:grid-cols-12 gap-12" id="about">
        <div className="md:col-span-4">
          <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-widest border-b border-outline-variant pb-4 mb-6">Core stack</h3>
          <div className="flex flex-wrap gap-2">
            {loading ? [60, 80, 55, 70, 65].map((w, i) => <Skeleton key={i} w={w} h={28} />)
              : (stack || []).map(s => <span key={s} className="chip px-4 py-2 border border-outline-variant font-mono text-xs text-on-surface uppercase tracking-wider cursor-default">{s}</span>)
            }
          </div>
        </div>

        <div className="md:col-span-8">
          <h2 className="font-display text-3xl text-on-surface mb-6">Behind the commits.</h2>
          <div className="space-y-5 text-on-surface-variant leading-relaxed">
            <p>I'm Belal, a 19-year-old 3rd-year CS student in Egypt.</p>
            <p>My focus is on backend architecture, databases, and competitive programming. When I'm not shipping full-stack code, my time goes into training on the fencing piste, working on 3D visualization in Blender, or obsessing over 90s JDM cars.</p>
            <p>I believe in zero-bloat architecture, raw performance, and building tools from scratch until they run perfectly. That's the whole pitch.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center py-8 px-2 max-w-7xl mx-auto gap-6">
          <span className="font-display text-2xl tracking-tight">belloo</span>
          
          <div className="flex items-center gap-6">
            <a href="mailto:belal.mahmoud.121007@gmail.com" className="font-mono text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors hover-target outline-none">
              Email
            </a>
            <a href="https://www.linkedin.com/in/belal-mahmoud-a78546363" target="_blank" rel="noreferrer" className="font-mono text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors hover-target outline-none">
              LinkedIn
            </a>
            <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant border-l border-outline-variant pl-6 ml-2">
              Built lean.
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}