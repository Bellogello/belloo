export default function Navbar({ isScrolled }) {
  return (
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
  );
}