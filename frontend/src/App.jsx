import { useState } from "react";
import UploadForm from "./components/UploadForm";
import ResultsPanel from "./components/ResultsPanel";

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1D1B16] relative" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="fixed inset-0 paper-texture opacity-40 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 py-12 relative">
        <header className="mb-10 border-b border-[#DEDACD] pb-6 relative overflow-hidden">
          <p className="text-xs tracking-widest uppercase text-[#8a8577]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            Document Analysis — v0.1
          </p>
          <h1 className="text-5xl mt-1 relative inline-block" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>
            Resume Scanner
            <span className="absolute -right-3 top-1 w-1.5 h-1.5 rounded-full bg-[#3D8361]" style={{ animation: "pulseText 2s ease infinite" }} />
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10">
          <div className="lg:sticky lg:top-12 self-start">
            <UploadForm onResult={setResult} />
          </div>
          <ResultsPanel data={result} />
        </div>
      </div>
    </div>
  );
}