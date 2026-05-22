const HEADLINE_WORDS = "Some people have a five-year plan. I have a Honda Civic and a compiler.".split(" ");

export default function Hero() {
  return (
    <section className="w-full min-h-[85vh] flex flex-col justify-center border-b border-outline-variant py-24 relative" id="hero">
      <div className="flex items-center gap-4 mb-8">
        <span className="font-mono text-xs text-primary uppercase tracking-widest">Belal Mahmoud</span>
        <span className="w-8 h-px bg-outline-variant"></span>
        <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">[belloo]</span>
      </div>

      <h1 className="font-display text-5xl md:text-7xl text-on-surface leading-tight tracking-tight mb-8 max-w-3xl">
        {HEADLINE_WORDS.map((w, i) => (
          <span key={i} className="hw" style={{ animationDelay: `${i * 0.07}s` }}>{w} </span>
        ))}
      </h1>

      <p className="font-body text-lg text-on-surface-variant mb-12 max-w-xl leading-relaxed">
        Full-stack developer. AI/ML incoming. Building things that didn't exist before — web apps, intelligent systems, and soon, hardware.
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
  );
}