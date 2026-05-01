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
        <div className="eyebrow">Workspace access</div>
        <h1>
          Access your company expense workspace securely.
        </h1>
        <p className="muted">
          Return to expense operations, review recent company activity, and step back into your advisor-enabled
          workspace.
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
        <div className="eyebrow">Workspace summary</div>
        <h2 className="card-title">Resume current expense operations without losing context.</h2>
        <p className="muted">
          After signing in, you can record company expenses, import invoices, review concise summaries, and ask the
          business advisor for fast context.
        </p>
        <div className="summary-strip">
          <span className="summary-chip">Capture records</span>
          <span className="summary-chip">Review analytics</span>
          <span className="summary-chip">Ask the advisor</span>
        </div>
        <div className="feature-list">
          <div className="feature-item corner-accent">
            <strong>Expense operations center</strong>
            <span className="muted">Track operating spend totals and add new records quickly.</span>
          </div>
          <div className="feature-item corner-accent">
            <strong>Analytics and advisor</strong>
            <span className="muted">Review trends and ask quick questions when leadership needs context.</span>
          </div>
        </div>
      </aside>
    </section>
  );
}
