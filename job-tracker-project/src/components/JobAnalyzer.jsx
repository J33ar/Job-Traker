// src/components/JobAnalyzer.jsx
import React, { useState } from "react";
import { ai } from "../api/ai";
import { RadialBarChart, RadialBar, Legend, Tooltip } from "recharts";

export default function JobAnalyzer() {
  const [job, setJob] = useState("");
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [includeResume, setIncludeResume] = useState(false);

  const onAnalyze = async () => {
    setError("");
    if (!job.trim()) return setError("Paste a job description.");
    setLoading(true);
    try {
      const data = await ai.job(job, includeResume ? resume : undefined);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const chartData = result ? [{ name: "Fit", value: Number(result.suitability) || 0, fill: "#3182ce" }] : [];

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold">Job Description Analyzer</h2>

      {/* نص داكن وخلفية بيضا + فوكس واضح */}
      <textarea
        className="w-full min-h-[140px] bg-white text-slate-900 placeholder:text-slate-500 border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Paste job description here..."
        value={job}
        onChange={(e) => setJob(e.target.value)}
      />

      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={includeResume}
          onChange={(e) => setIncludeResume(e.target.checked)}
        />
        Include my resume text
      </label>

      {includeResume && (
        <textarea
          className="w-full min-h-[120px] bg-white text-slate-900 placeholder:text-slate-500 border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Paste your resume (optional)"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />
      )}

      <button
        onClick={onAnalyze}
        disabled={loading}
        className="mt-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}

      {result && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* بطاقة المهارات/الكلمات */}
          <div className="border border-slate-200 rounded-lg p-4 bg-white text-slate-900 shadow-sm">
            <h3 className="font-semibold mb-2 text-slate-900">Key Required Skills</h3>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              {result.skills?.map((s, i) => <li key={i} className="text-slate-800">{s}</li>)}
            </ul>

            <h3 className="font-semibold mt-4 mb-2 text-slate-900">Recommended Keywords</h3>
            <ul className="flex flex-wrap gap-2">
              {result.keywords?.map((k, i) => (
                <span key={i} className="text-xs bg-slate-200 text-slate-800 rounded-full px-2 py-1">
                  {k}
                </span>
              ))}
            </ul>
          </div>

          {/* بطاقة نسبة الملاءمة */}
          <div className="border border-slate-200 rounded-lg p-4 bg-white text-slate-900 shadow-sm flex flex-col items-center justify-center">
            <h3 className="font-semibold mb-2 text-slate-900">Suitability Rating</h3>
            <div className="w-full flex flex-col items-center">
              <RadialBarChart
                width={260}
                height={260}
                innerRadius="60%"
                outerRadius="100%"
                data={chartData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar minAngle={15} background clockWise dataKey="value" />
                <Legend />
                <Tooltip />
              </RadialBarChart>
              <br />
              <div className="text-3xl font-bold -mt-8 text-slate-900">
                {Math.round(result.suitability)}%
              </div>
              <p className="text-sm text-slate-700 text-center mt-2">
                {result.reasoning}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
