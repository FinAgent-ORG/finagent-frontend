"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { insightsApi } from "@/src/lib/api-client.js";
import { sanitizeLines, sanitizeText } from "@/src/lib/sanitize.js";
import { useAppError } from "@/src/state/AppErrorContext.jsx";
import { useAuth } from "@/src/state/AuthContext.jsx";

export default function InsightsPage() {
  const router = useRouter();
  const { loading, user } = useAuth();
  const { setError } = useAppError();
  const [insights, setInsights] = useState({ insights: [], suggestions: [] });
  const [refreshing, setRefreshing] = useState(false);

  async function refresh() {
    setRefreshing(true);
    setError("");

    try {
      const summary = await insightsApi.getSummary();
      setInsights({
        insights: sanitizeLines(summary.insights ?? []),
        suggestions: sanitizeLines(summary.suggestions ?? []),
      });
    } catch (error) {
      if (error.status === 401) {
        router.replace("/signin");
        return;
      }
      setError(sanitizeText(error.message));
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    if (!loading && user) {
      refresh();
    }
  }, [loading, user]);

  if (loading || !user) {
    return (
      <section className="panel session-message">
        <div className="eyebrow">Insights</div>
        <h1>Loading your insights...</h1>
      </section>
    );
  }

  return (
    <section className="dashboard-grid">
      <section className="panel dashboard-section span-12 insight-hero ai-panel glow-card">
        <div>
          <div className="eyebrow">Insights</div>
          <h1 className="card-title">Understand recent spending patterns and what to do next.</h1>
          <p className="muted">
            This page turns your recent expense history into plain-language observations and suggestions so you can
            spot changes quickly.
          </p>
        </div>
        <button className="button" disabled={refreshing} onClick={refresh} type="button">
          {refreshing ? "Refreshing..." : "Refresh Insights"}
        </button>
      </section>

      <section className="panel dashboard-section span-6 stack ai-panel">
        <div>
          <div className="eyebrow">What changed</div>
          <h2 className="card-title">Spending insights</h2>
        </div>
        <ul className="clean">
          {insights.insights.length ? (
            insights.insights.map((line) => (
              <li className="list-item" key={line}>
                <span className="item-pill ai">AI signal</span>
                <span>{line}</span>
              </li>
            ))
          ) : (
            <li className="empty-state">
              <strong>No insight summary yet</strong>
              Refresh insights to generate an updated read on recent expense behavior.
            </li>
          )}
        </ul>
      </section>

      <section className="panel dashboard-section span-6 stack">
        <div>
          <div className="eyebrow">Next moves</div>
          <h2 className="card-title">Suggestions</h2>
        </div>
        <ul className="clean">
          {insights.suggestions.length ? (
            insights.suggestions.map((line) => (
              <li className="list-item" key={line}>
                <span className="item-pill">Recommended</span>
                <span>{line}</span>
              </li>
            ))
          ) : (
            <li className="empty-state">
              <strong>No suggestions yet</strong>
              Suggestions will appear here after the insight engine evaluates your ledger.
            </li>
          )}
        </ul>
      </section>
    </section>
  );
}
