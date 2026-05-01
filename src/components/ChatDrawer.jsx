"use client";

import { useEffect, useState } from "react";

import { BRAND } from "@/src/constants/branding.js";
import { chatApi } from "@/src/lib/api-client.js";
import { sanitizeText } from "@/src/lib/sanitize.js";
import { useAppError } from "@/src/state/AppErrorContext.jsx";
import { useAuth } from "@/src/state/AuthContext.jsx";

export default function ChatDrawer() {
  const { user } = useAuth();
  const { setError } = useAppError();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 720px)");

    function syncLayout(event) {
      setIsMobile(event.matches);
      setIsOpen((current) => (event.matches ? true : current));
    }

    syncLayout(mediaQuery);
    mediaQuery.addEventListener("change", syncLayout);

    return () => {
      mediaQuery.removeEventListener("change", syncLayout);
    };
  }, []);

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
        { role: "assistant", text: "I could not complete that business request right now." },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  const drawerOpen = isMobile || isOpen;

  return (
    <>
      <button
        aria-hidden={!drawerOpen || isMobile}
        className={`chat-backdrop ${drawerOpen && !isMobile ? "open" : ""}`}
        onClick={() => setIsOpen(false)}
        tabIndex={drawerOpen && !isMobile ? 0 : -1}
        type="button"
      />
      {isMobile ? null : (
        <button
          aria-expanded={drawerOpen}
          className="chat-fab"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          {drawerOpen ? "Close Advisor" : "Open Advisor"}
        </button>
      )}

      <aside aria-hidden={!drawerOpen} className={`chat-drawer panel ${drawerOpen ? "open" : ""}`}>
        <div className="chat-drawer-header">
          <div className="chat-intro">
            <h2 className="card-title">{BRAND.assistantRole}</h2>
            <p className="muted">Ask about company spend, categories, vendors, trends, or recent operating activity.</p>
          </div>
          {isMobile ? null : (
            <button className="button secondary" onClick={() => setIsOpen(false)} type="button">
              Close
            </button>
          )}
        </div>

        <div className="chat-log">
          {chatHistory.length ? null : (
            <div className="chat-hint" aria-live="polite">
              Example: "Which category changed most this week?"
            </div>
          )}
          {chatHistory.map((item, index) => (
            <div className={`bubble ${item.role}`} key={`${item.role}-${index}`}>
              <span className="bubble-label">{item.role === "user" ? "You" : BRAND.name}</span>
              {item.text}
            </div>
          ))}
          {chatLoading ? (
            <div className="bubble assistant">
              <span className="bubble-label">{BRAND.name}</span>
              {BRAND.assistantName}
              {" "}
              is analyzing...
            </div>
          ) : null}
        </div>

        <form className="chat-form" onSubmit={handleSubmit}>
          <input
            className="chat-input"
            onChange={(event) => setChatMessage(event.target.value)}
            placeholder="Ask about expense activity, cost trends, or operational forecasts"
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
