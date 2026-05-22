export default function Navbar() {
  return (
    <nav className="w-full border-b border-outline-variant fixed top-0 left-0 z-50 bg-[#0f0d18]/90 backdrop-blur">
      <div className="flex justify-between items-center px-6 md:px-16 py-4 max-w-7xl mx-auto">
        <a href="/" className="font-display text-2xl tracking-tight text-on-surface hover:text-primary transition-colors hover-target outline-none">
          belloo
        </a>
        <div className="flex gap-8 items-center">
          <a href="/" className="font-mono text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors hover-target outline-none">Home</a>
          <a href="/projects" className="font-mono text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors hover-target outline-none">Projects</a>
          <a href="/contact"  className="font-mono text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors hover-target outline-none">Contact</a>
        </div>
      </div>
    </nav>
  );
}