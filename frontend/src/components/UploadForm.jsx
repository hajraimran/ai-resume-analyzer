import { useState } from "react";
import axios from "axios";

export default function UploadForm({ onResult }) {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("resume", file);
    if (jd) formData.append("job_description", jd);

    try {
      const res = await axios.post("http://localhost:8000/analyze", formData);
      onResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="text-sm text-[#8a8577] mb-4 leading-relaxed">
        Upload a resume to get an ATS score, skill breakdown, and line-by-line improvements.
      </p>
      <form onSubmit={handleSubmit} className="relative bg-white border border-[#DEDACD] rounded-lg p-5 space-y-4 overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-[1px]">
            <div
              className="absolute left-0 right-0 h-16"
              style={{
                background: "linear-gradient(180deg, transparent, rgba(61,131,97,0.25), transparent)",
                animation: "scanSweep 1.6s linear infinite",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-xs tracking-widest uppercase text-[#3D8361]" style={{ fontFamily: "'IBM Plex Mono', monospace", animation: "pulseText 1.4s ease infinite" }}>
                Analyzing document...
              </p>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs tracking-wide uppercase text-[#8a8577] mb-2" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            Resume (PDF)
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:bg-[#1D1B16] file:text-white file:text-xs file:cursor-pointer cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-xs tracking-wide uppercase text-[#8a8577] mb-2" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            Job Description
          </label>
          <textarea
            placeholder="Paste to enable keyword matching"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            className="w-full border border-[#DEDACD] rounded p-2 h-32 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D8361]"
          />
        </div>
 
        <button
          type="submit"
          disabled={loading || !file}
          className="w-full bg-[#1D1B16] text-white py-2.5 rounded text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#3D8361] transition-colors"
        >
          {loading ? "Scanning..." : "Analyze Resume"}
        </button>
  
        {error && <p className="text-sm text-[#C2703D]">{error}</p>}
      </form>
    </div>
  );
}