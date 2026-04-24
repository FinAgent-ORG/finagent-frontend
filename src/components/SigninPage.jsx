"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { sanitizeText } from "@/src/lib/sanitize.js";
import { useAppError } from "@/src/state/AppErrorContext.jsx";
import { useAuth } from "@/src/state/AuthContext.jsx";

export default function SigninPage({ nextPath = "/dashboard" }) {
  const router = useRouter();
  const { signin } = useAuth();
  const { setError } = useAppError();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        await signin(form);
        router.push(nextPath);
        router.refresh();
      } catch (error) {
        setError(sanitizeText(error.message));
      }
    });
  }

  return (
    <section className="auth-shell">
      <section className="panel auth-card">
        <div className="eyebrow">Welcome back</div>
        <h1>Sign in to continue.</h1>
        <p className="muted">
          Return to your dashboard, review recent expenses, and check updated insights.
        </p>
        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              autoComplete="email"
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
              type="email"
              value={form.email}
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              autoComplete="current-password"
              minLength={12}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              required
              type="password"
              value={form.password}
            />
          </label>
          <button className="button" disabled={isPending} type="submit">
            {isPending ? "Signing in..." : "Enter Workspace"}
          </button>
        </form>
      </section>
      <aside className="panel auth-aside">
        <div className="eyebrow">Workspace</div>
        <h2 className="card-title">Pick up where you left off.</h2>
        <p className="muted">
          After signing in, you can log expenses, import receipts, and review concise summaries of recent activity.
        </p>
        <div className="summary-strip">
          <span className="summary-chip">Add expenses</span>
          <span className="summary-chip">Import receipts</span>
          <span className="summary-chip">Review insights</span>
        </div>
        <div className="feature-list">
          <div className="feature-item">
            <strong>Dashboard</strong>
            <span className="muted">Track spending totals and add new entries quickly.</span>
          </div>
          <div className="feature-item">
            <strong>Insights and assistant</strong>
            <span className="muted">Review trends and ask quick questions when you need extra context.</span>
          </div>
        </div>
      </aside>
    </section>
  );
}
