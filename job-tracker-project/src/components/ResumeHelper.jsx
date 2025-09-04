// src/components/ResumeHelper.jsx
import React, { useState } from "react";
import { ai } from "../api/ai";

export default function ResumeHelper() {
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onAnalyze = async () => {
    setError("");
    if (!resumeText.trim()) return setError("Please paste your resume text.");
    setLoading(true);
    try {
      const data = await ai.resume(resumeText);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type === "text/plain") {
      const text = await file.text();
      setResumeText(text);
    } else {
      alert("For simplicity, please upload a .txt file or paste your resume.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold">Resume Helper</h2>

      <div className="space-y-2">
        <textarea
          className="w-full min-h-[160px] border rounded p-3"
          placeholder="Paste your resume text here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />
        <div className="flex items-center gap-3">
          <input type="file" accept=".txt" onChange={onFile} />
          <button
            onClick={onAnalyze}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card title="Grammar Improvements" items={result.grammar} />
          <Card title="Strengths" items={result.strengths} />
          <Card title="Weaknesses" items={result.weaknesses} />
          <Card title="Keywords to Add" items={result.keywords} />
        </div>
      )}
    </div>
  );
}

function Card({ title, items = [] }) {
  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-white text-slate-900 shadow-sm">
      <h3 className="font-semibold mb-2 text-slate-900">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-slate-600">No suggestions.</p>
      ) : (
        <ul className="list-disc ml-5 space-y-1">
          {items.map((x, i) => (
            <li key={i} className="text-sm text-slate-800">{x}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

