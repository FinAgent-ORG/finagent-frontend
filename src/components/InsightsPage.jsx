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
      <section className="panel dashboard-section span-12 insight-hero">
        <div>
          <div className="eyebrow">Insights</div>
          <h1 className="card-title">Patterns pulled from your latest expense history.</h1>
          <p className="muted">
            This tab keeps analysis separate from the operational dashboard so logging and review stay fast.
          </p>
        </div>
        <button className="button" disabled={refreshing} onClick={refresh} type="button">
          {refreshing ? "Refreshing..." : "Refresh Insights"}
        </button>
      </section>

      <section className="panel dashboard-section span-6 stack">
        <div className="eyebrow">What changed</div>
        <h2 className="card-title">Spending insights</h2>
        <ul className="clean">
          {insights.insights.map((line) => (
            <li className="list-item" key={line}>
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel dashboard-section span-6 stack">
        <div className="eyebrow">Next moves</div>
        <h2 className="card-title">Suggestions</h2>
        <ul className="clean">
          {insights.suggestions.map((line) => (
            <li className="list-item" key={line}>
              {line}
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
