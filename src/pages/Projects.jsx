export default function Projects({ projects }) {
  return (
    <div className="w-full py-24">
      <h1 className="font-display text-4xl text-on-surface mb-12">Archive.</h1>
      <div className="flex flex-col gap-4">
        {projects.map(p => (
          <div key={p.id} className="card p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 hover-target cursor-pointer" onClick={() => window.open(p.url, "_blank")}>
            <div>
              <h3 className="font-display text-xl text-on-surface mb-1">{p.name}</h3>
              <p className="font-body text-xs text-on-surface-variant">{p.desc}</p>
            </div>
            <div className="flex flex-wrap gap-2 md:justify-end">
              {p.tags.map(t => <span key={t} className="chip px-3 py-1 border border-outline-variant font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}