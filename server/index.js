// server/index.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

if (!process.env.GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY in .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

function safeJsonFromGeminiText(text) {
  try {
    const cleaned = text
      .replace(/^```json\n?/i, "")
      .replace(/^```\n?/i, "")
      .replace(/```$/i, "")
      .trim();
    return JSON.parse(cleaned);
  } catch (e) {
    return null;
  }
}

// Health check
app.get("/api/health", (_, res) => res.json({ ok: true }));

// 1) Resume Helper
app.post("/api/ai/resume", async (req, res) => {
  const { resumeText } = req.body || {};
  if (!resumeText) return res.status(400).json({ error: "resumeText is required" });

  const prompt = `You are a precise resume coach. Analyze this resume text and respond in strict JSON only.

Resume:
"""${resumeText}"""

Return JSON with keys:
- grammar: array of concise suggestions
- strengths: array of strong points
- weaknesses: array of weak points
- keywords: array of keywords to add (role-specific)
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const data = safeJsonFromGeminiText(text) || {
      grammar: [], strengths: [], weaknesses: [], keywords: []
    };
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI_ERROR", details: err.message });
  }
});

// 2) Job Description Analyzer
app.post("/api/ai/job", async (req, res) => {
  const { jobDescription, resumeText } = req.body || {};
  if (!jobDescription) return res.status(400).json({ error: "jobDescription is required" });

  const prompt = `You are an ATS-savvy career assistant. Analyze the job description (and optional resume) and respond in strict JSON only.

Job Description:
"""${jobDescription}"""

${resumeText ? `Candidate Resume:
"""${resumeText}"""` : ""}

Return JSON with keys:
- skills: array of key required skills
- keywords: array of recommended keywords
- suitability: integer 0-100 (decimal ok)
- reasoning: short string (<= 280 chars)
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const data = safeJsonFromGeminiText(text) || {
      skills: [], keywords: [], suitability: 0, reasoning: ""
    };
    let s = Number(data.suitability);
    if (Number.isNaN(s)) s = 0;
    data.suitability = Math.max(0, Math.min(100, s));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI_ERROR", details: err.message });
  }
});

// 3) Dashboard Insights
app.post("/api/ai/insights", async (req, res) => {
  const { stats } = req.body || {};
  if (!stats) return res.status(400).json({ error: "stats is required" });

  const prompt = `You are a motivational career coach. Given these job search stats, write a brief, upbeat summary (2-3 sentences).

Stats JSON: ${JSON.stringify(stats)}

Tone: supportive, specific, tangible. Avoid generic fluff. Return JSON: {
  "summary": string
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const data = safeJsonFromGeminiText(text) || { summary: "Keep going — you’ve got this!" };
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI_ERROR", details: err.message });
  }
});

// 4) Chatbot
app.post("/api/ai/chat", async (req, res) => {
  const { history = [], message } = req.body || {};
  if (!message) return res.status(400).json({ error: "message is required" });

  try {
    const chat = model.startChat({
      history: history.map(m => ({ role: m.role, parts: [{ text: m.text }] }))
    });
    const result = await chat.sendMessage(message);
    const text = result.response.text();
    res.json({ reply: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI_ERROR", details: err.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`AI server listening on :${PORT}`));
