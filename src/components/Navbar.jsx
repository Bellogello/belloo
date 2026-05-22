export default function Navbar() {
  
  // Custom navigation that doesn't trigger a page reload
  const navigate = (e, path) => {
    e.preventDefault();
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <nav className="w-full border-b border-outline-variant fixed top-0 left-0 z-50 bg-[#0f0d18]/90 backdrop-blur">
      <div className="flex justify-between items-center px-6 md:px-16 py-4 max-w-7xl mx-auto">
        <a href="/" onClick={(e) => navigate(e, "/")} className="font-display text-2xl tracking-tight text-on-surface hover:text-primary transition-colors hover-target outline-none" style={{ cursor: 'none' }}>
          belloo
        </a>
        <div className="flex gap-8 items-center">
          <a href="/" onClick={(e) => navigate(e, "/")} className="font-mono text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors hover-target outline-none" style={{ cursor: 'none' }}>Home</a>
          <a href="/projects" onClick={(e) => navigate(e, "/projects")} className="font-mono text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors hover-target outline-none" style={{ cursor: 'none' }}>Projects</a>
          <a href="/contact" onClick={(e) => navigate(e, "/contact")} className="font-mono text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors hover-target outline-none" style={{ cursor: 'none' }}>Contact</a>
        </div>
      </div>
    </nav>
  );
}