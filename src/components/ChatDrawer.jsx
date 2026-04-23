"use client";

import { useState } from "react";

import { chatApi } from "@/src/lib/api-client.js";
import { sanitizeText } from "@/src/lib/sanitize.js";
import { useAppError } from "@/src/state/AppErrorContext.jsx";
import { useAuth } from "@/src/state/AuthContext.jsx";

export default function ChatDrawer() {
  const { user } = useAuth();
  const { setError } = useAppError();
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const suggestions = [
    "Summarize my grocery spend this month",
    "What changed most this week?",
    "Help me log a transport expense",
  ];

  if (!user) {
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!chatMessage.trim()) {
      return;
    }

    const outgoing = { role: "user", text: sanitizeText(chatMessage) };
    const nextHistory = [...chatHistory, outgoing];
    setChatHistory(nextHistory);
    setChatMessage("");
    setChatLoading(true);

    try {
      const response = await chatApi.sendMessage({
        history: nextHistory,
        message: outgoing.text,
      });
      setChatHistory((current) => [...current, { role: "assistant", text: sanitizeText(response.response) }]);
    } catch (error) {
      setError(sanitizeText(error.message));
      setChatHistory((current) => [
        ...current,
        { role: "assistant", text: "I could not complete that request right now." },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  function useSuggestion(text) {
    setChatMessage(text);
  }

  return (
    <>
      <button
        aria-expanded={isOpen}
        className="chat-fab"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        {isOpen ? "Close Assistant" : "Ask FinAgent"}
      </button>

      <aside className={`chat-drawer panel ai-panel ${isOpen ? "open" : ""}`}>
        <div className="chat-drawer-header">
          <div className="chat-intro">
            <div className="eyebrow">Assistant</div>
            <h2 className="card-title">Quick chat</h2>
            <p className="muted">Ask about trends, quick logging, or what changed most recently.</p>
          </div>
          <button className="button secondary" onClick={() => setIsOpen(false)} type="button">
            Hide
          </button>
        </div>

        <div className="chat-log">
          {chatHistory.length ? null : (
            <div className="bubble assistant">
              <strong>Start with a prompt</strong>
              <span>Ask about expenses, trends, or quick logging help.</span>
            </div>
          )}
          {chatHistory.map((item, index) => (
            <div className={`bubble ${item.role}`} key={`${item.role}-${index}`}>
              <span className="bubble-label">{item.role === "user" ? "You" : "FinAgent"}</span>
              {item.text}
            </div>
          ))}
          {chatLoading ? (
            <div className="bubble assistant">
              <span className="bubble-label">FinAgent</span>
              FinAgent is thinking...
            </div>
          ) : null}
        </div>

        <div className="chat-suggestions">
          {suggestions.map((suggestion) => (
            <button
              className="suggestion-pill"
              key={suggestion}
              onClick={() => useSuggestion(suggestion)}
              type="button"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <form className="chat-form" onSubmit={handleSubmit}>
          <input
            className="chat-input"
            onChange={(event) => setChatMessage(event.target.value)}
            placeholder="Try: summarize my grocery spend this month"
            type="text"
            value={chatMessage}
          />
          <button className="button" disabled={chatLoading} type="submit">
            {chatLoading ? "Sending..." : "Send"}
          </button>
        </form>
      </aside>
    </>
  );
}
