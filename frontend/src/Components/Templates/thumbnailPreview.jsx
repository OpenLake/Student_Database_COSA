/* ── thumbnail pattern generator ────────────────────────── */
export default function ThumbnailPreview({ template }){
    const c = template.color;
    return (
      <div className="relative w-full h-full overflow-hidden" style={{ background: `${c}15` }}>
        {/* decorative lines */}
        <div className="absolute inset-0 flex flex-col justify-center items-center gap-1.5 p-4">
          <div className="w-3/4 h-0.5 rounded-full opacity-20" style={{ background: c }} />
          <div className="w-1/2 h-3 rounded-sm opacity-10" style={{ background: c }} />
          <div className="w-2/3 h-0.5 rounded-full opacity-15" style={{ background: c }} />
          <div className="w-1/2 h-0.5 rounded-full opacity-10" style={{ background: c }} />
          <div className="mt-1 w-10 h-10 rounded-full border-2 opacity-20 flex items-center justify-center" style={{ borderColor: c }}>
            <div className="w-5 h-5 rounded-full opacity-30" style={{ background: c }} />
          </div>
          <div className="w-2/3 h-0.5 rounded-full opacity-10 mt-1" style={{ background: c }} />
          <div className="w-1/2 h-0.5 rounded-full opacity-10" style={{ background: c }} />
        </div>
        {/* corner accents */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 rounded-tl opacity-30" style={{ borderColor: c }} />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 rounded-tr opacity-30" style={{ borderColor: c }} />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 rounded-bl opacity-30" style={{ borderColor: c }} />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 rounded-br opacity-30" style={{ borderColor: c }} />
        {/* category chip */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2">
          <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-white/80" style={{ background: `${c}90` }}>
            {template.category}
          </span>
        </div>
      </div>
    );
  };
  