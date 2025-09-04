// client/src/components/Chatbot.jsx
import React, { useState, useRef, useEffect } from "react";
import { ai } from "../api/ai";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // { role: "user"|"model", text }
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const current = input;
    setMessages((prev) => [...prev, { role: "user", text: current }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await ai.chat(messages, current);
      setMessages((prev) => [...prev, { role: "model", text: res.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "model", text: "(Error: could not fetch reply)" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-2">Career Chatbot</h2>
      <div className="h-96 overflow-y-auto border p-4 mb-2 space-y-2 bg-white rounded">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`px-3 py-2 rounded max-w-[80%] ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-orange-200 text-orange-900"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

<form onSubmit={handleSubmit} className="flex items-center gap-3 mt-3">
  <input
    type="text"
    dir="auto"
    className="
      flex-grow
      bg-white text-slate-900 placeholder:text-slate-500
      border border-slate-300 rounded-lg
      px-3 py-2 shadow-sm
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
      disabled:opacity-60
    "
    placeholder="Ask about resumes, interviews..."
    value={input}
    onChange={(e) => setInput(e.target.value)}
    disabled={isLoading}
  />
  <button
    type="submit"
    className="
      shrink-0
      inline-flex items-center justify-center
      bg-blue-600 hover:bg-blue-700
      text-white font-medium
      px-4 py-2 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-blue-500
      disabled:opacity-60
    "
    disabled={isLoading}
  >
    {isLoading ? "Wait" : "Send"}
  </button>
</form>

    </div>
  );
}
