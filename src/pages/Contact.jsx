export default function Contact() {
  return (
    <div className="w-full min-h-[75vh] flex flex-col justify-center animate-fade-in" style={{ animation: "fadeIn .4s ease forwards" }}>
      
      <div className="flex items-center gap-4 mb-8">
        <span className="font-mono text-xs text-primary uppercase tracking-widest">Connect</span>
        <span className="w-8 h-px bg-outline-variant" />
      </div>

      <h1 className="font-display text-5xl md:text-7xl text-on-surface leading-tight tracking-tight mb-8">
        Let's build <br/><span className="text-primary">something.</span>
      </h1>
      
      <p className="font-body text-lg text-on-surface-variant mb-16 max-w-xl leading-relaxed">
        Whether it's raw backend architecture, a full-stack project, or just talking about zero-bloat systems, my inbox is open.
      </p>
      
      <div className="flex flex-col gap-8">
        {/* Email */}
        <a href="mailto:belal.mahmoud.121007@gmail.com" className="group flex items-center gap-6 w-fit hover-target outline-none">
          <div className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">mail</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Email</span>
            <span className="font-body text-lg md:text-xl text-on-surface group-hover:text-primary transition-colors">belal.mahmoud.121007@gmail.com</span>
          </div>
        </a>
        
        {/* LinkedIn */}
        <a href="https://www.linkedin.com/in/belal-mahmoud-a78546363" target="_blank" rel="noreferrer" className="group flex items-center gap-6 w-fit hover-target outline-none">
          <div className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">link</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Network</span>
            <span className="font-body text-lg md:text-xl text-on-surface group-hover:text-primary transition-colors">LinkedIn Profile</span>
          </div>
        </a>

        {/* GitHub */}
        <a href="https://github.com/Bellogello" target="_blank" rel="noreferrer" className="group flex items-center gap-6 w-fit hover-target outline-none">
          <div className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">code</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Code</span>
            <span className="font-body text-lg md:text-xl text-on-surface group-hover:text-primary transition-colors">github.com/Bellogello</span>
          </div>
        </a>
      </div>

    </div>
  );
}