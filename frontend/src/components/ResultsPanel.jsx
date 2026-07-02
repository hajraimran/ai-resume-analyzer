import { useEffect, useState } from "react";

function useCountUp(target, duration = 800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

function ScoreGauge({ score }) {
  const animatedScore = useCountUp(score);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const color = score >= 80 ? "#3D8361" : score >= 60 ? "#C2703D" : "#B0413E";

  return (
    <div className="relative w-32 h-32 shrink-0">
      <svg width="128" height="128" className="-rotate-90">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="#E5E1D3" strokeWidth="10" />
        <circle
          cx="64" cy="64" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl" style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500 }}>{animatedScore}</span>
        <span className="text-[10px] text-[#8a8577] uppercase tracking-wide">ATS</span>
      </div>
    </div>
  );
}

function BreakdownBar({ label, entry, delay }) {
  const pct = (entry.score / entry.max) * 100;
  const color = pct >= 80 ? "#3D8361" : pct >= 50 ? "#C2703D" : "#B0413E";
  return (
    <div className="fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-xs" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{label}</span>
        <span className="text-xs text-[#8a8577]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{entry.score}/{entry.max}</span>
      </div>
      <div className="h-1.5 bg-[#E5E1D3] rounded-full overflow-hidden mb-1.5">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color, transition: "width 0.6s ease" }} />
      </div>
      <p className="text-xs text-[#8a8577] leading-relaxed">{entry.note}</p>
    </div>
  );
}

function Chip({ label, variant, delay }) {
  const styles = variant === "found"
    ? "bg-[#3D8361]/10 text-[#3D8361] border-[#3D8361]/30"
    : "bg-transparent text-[#C2703D] border-[#C2703D]/40 border-dashed";
  return (
    <span
      className={`fade-in-up inline-block px-2.5 py-1 rounded-full text-xs border ${styles} mr-1.5 mb-1.5`}
      style={{ fontFamily: "'IBM Plex Mono', monospace", animationDelay: `${delay}ms` }}
    >
      {label}
    </span>
  );
}

const PRIORITY_STYLES = {
  high: { border: "#B0413E", label: "High", bg: "bg-[#B0413E]/10", text: "text-[#B0413E]" },
  medium: { border: "#C2703D", label: "Medium", bg: "bg-[#C2703D]/10", text: "text-[#C2703D]" },
  low: { border: "#8a8577", label: "Low", bg: "bg-[#8a8577]/10", text: "text-[#8a8577]" },
};

export default function ResultsPanel({ data }) {
  if (!data) {
    return (
      <div className="border border-dashed border-[#DEDACD] rounded-lg p-16 text-center text-[#8a8577]">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="mx-auto mb-4 opacity-50">
          <path d="M6 2h9l5 5v15a1 1 0 01-1 1H6a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M15 2v5h5" stroke="currentColor" strokeWidth="1.3"/>
          <line x1="8" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.3"/>
          <line x1="8" y1="17" x2="13" y2="17" stroke="currentColor" strokeWidth="1.3"/>
        </svg>
        <p className="text-sm">Upload a resume to see your scan results.</p>
      </div>
    );
  }

  const { ats, skill_analysis, strengths, improvements, overall_feedback } = data;
  const sortedImprovements = [...improvements].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
  });

  return (
    <div className="space-y-8">
      <div className="fade-in-up bg-white border border-[#DEDACD] rounded-lg p-6">
        <div className="flex items-center gap-6 mb-5">
          <ScoreGauge score={ats.ats_score} />
          <div>
            {ats.keyword_match_pct !== null ? (
              <p className="text-sm text-[#8a8577]">
                <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{ats.keyword_match_pct}%</span> keyword match against job description
              </p>
            ) : (
              <p className="text-sm text-[#8a8577]">Paste a job description to enable keyword matching</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 border-t border-[#DEDACD]">
          {Object.entries(ats.breakdown).map(([key, entry], i) => (
            <BreakdownBar key={key} label={key.replace(/_/g, " ")} entry={entry} delay={i * 60} />
          ))}
        </div>
      </div>

      {strengths?.length > 0 && (
        <div className="fade-in-up bg-white border border-[#DEDACD] rounded-lg p-6" style={{ animationDelay: "80ms" }}>
          <h2 className="text-xs tracking-widest uppercase text-[#8a8577] mb-3" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>Strengths</h2>
          <ul className="space-y-2">
            {strengths.map((s, i) => (
              <li key={i} className="text-sm flex gap-2">
                <span className="text-[#3D8361] mt-0.5">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="fade-in-up bg-white border border-[#DEDACD] rounded-lg p-6" style={{ animationDelay: "140ms" }}>
        <h2 className="text-xs tracking-widest uppercase text-[#8a8577] mb-3" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>Skills Detected</h2>
        <div>{skill_analysis.identified_skills.map((s, i) => <Chip key={s} label={s} variant="found" delay={i * 40} />)}</div>

        {skill_analysis.missing_skills.length > 0 && (
          <>
            <h2 className="text-xs tracking-widest uppercase text-[#8a8577] mt-5 mb-3" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>Gaps</h2>
            <div>{skill_analysis.missing_skills.map((s, i) => <Chip key={s} label={s} variant="missing" delay={i * 40} />)}</div>
          </>
        )}
      </div>

      <div className="fade-in-up bg-white border border-[#DEDACD] rounded-lg p-6" style={{ animationDelay: "200ms" }}>
        <h2 className="text-xs tracking-widest uppercase text-[#8a8577] mb-4" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>Improvements</h2>
        <div className="space-y-4">
          {sortedImprovements.map((imp, i) => {
            const p = PRIORITY_STYLES[imp.priority] || PRIORITY_STYLES.low;
            return (
              <div key={i} className="fade-in-up pl-4" style={{ borderLeft: `2px solid ${p.border}`, animationDelay: `${250 + i * 80}ms` }}>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{imp.section}</p>
                  <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded ${p.bg} ${p.text}`} style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{p.label}</span>
                </div>
                <p className="text-sm text-[#8a8577] mt-0.5">{imp.issue}</p>
                <p className="text-sm mt-1">{imp.suggestion}</p>
              </div>
            );
          })}
        </div>
      </div>

      <p className="fade-in-up text-sm italic text-[#8a8577] leading-relaxed" style={{ animationDelay: "400ms" }}>{overall_feedback}</p>
    </div>
  );
}