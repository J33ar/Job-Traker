// client/src/api/ai.js
const API_BASE = process.env.REACT_APP_AI_API || "http://localhost:5001";

async function postJSON(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const ai = {
  resume: (resumeText) => postJSON("/api/ai/resume", { resumeText }),
  job: (jobDescription, resumeText) => postJSON("/api/ai/job", { jobDescription, resumeText }),
  insights: (stats) => postJSON("/api/ai/insights", { stats }),
  chat: (history, message) => postJSON("/api/ai/chat", { history, message }),
};
