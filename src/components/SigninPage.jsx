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
        <h1>Sign in to your finance cockpit.</h1>
        <p className="muted">
          Your browser stays on the frontend origin while the server handles every private cluster hop in the
          background.
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
      <aside className="panel auth-aside ai-panel">
        <div className="eyebrow">Why it feels clean</div>
        <h2 className="card-title">One polished entrypoint. Zero backend exposure.</h2>
        <p className="muted">
          Authentication, expense data, insights, and assistant responses stay behind the frontend boundary so the
          experience can feel seamless without weakening the security model.
        </p>
        <div className="summary-strip">
          <span className="summary-chip">Private auth</span>
          <span className="summary-chip">Cookie session</span>
          <span className="summary-chip">Secure proxy</span>
        </div>
        <div className="feature-list">
          <div className="feature-item">
            <strong>Single public surface</strong>
            <span className="muted">Users only interact with the frontend while services stay internal.</span>
          </div>
          <div className="feature-item">
            <strong>Fast product feel</strong>
            <span className="muted">The proxy model keeps the experience clean without exposing service topology.</span>
          </div>
        </div>
      </aside>
    </section>
  );
}
