"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { sanitizeText } from "@/src/lib/sanitize.js";
import { useAppError } from "@/src/state/AppErrorContext.jsx";
import { useAuth } from "@/src/state/AuthContext.jsx";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const { setError } = useAppError();
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      try {
        await signup({ email: form.email, password: form.password });
        router.push("/dashboard");
        router.refresh();
      } catch (error) {
        setError(sanitizeText(error.message));
      }
    });
  }

  return (
    <section className="auth-shell">
      <section className="panel auth-card">
        <div className="eyebrow">New workspace</div>
        <h1>Create a premium finance workspace in one step.</h1>
        <p className="muted">
          The frontend owns the session boundary and forwards auth requests privately inside the cluster.
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
              autoComplete="new-password"
              minLength={12}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              required
              type="password"
              value={form.password}
            />
          </label>
          <label className="field">
            <span>Confirm Password</span>
            <input
              autoComplete="new-password"
              minLength={12}
              onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
              required
              type="password"
              value={form.confirmPassword}
            />
          </label>
          <button className="button" disabled={isPending} type="submit">
            {isPending ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </section>
      <aside className="panel auth-aside">
        <div className="eyebrow">Built for clarity</div>
        <h2 className="card-title">Capture spending, surface patterns, and keep AI in the loop.</h2>
        <p className="muted">
          FinAgent combines manual entry, file extraction, and AI insight into a single dark-mode workspace that
          feels focused from the first screen.
        </p>
        <div className="summary-strip">
          <span className="summary-chip">Expense capture</span>
          <span className="summary-chip">Instant summaries</span>
          <span className="summary-chip">AI assistance</span>
        </div>
        <div className="feature-list">
          <div className="feature-item">
            <strong>Manual and imported entries</strong>
            <span className="muted">Log expenses directly or turn uploads into structured transactions.</span>
          </div>
          <div className="feature-item">
            <strong>Dedicated insights lane</strong>
            <span className="muted">Keep day-to-day entry fast while analysis and suggestions live in their own view.</span>
          </div>
        </div>
      </aside>
    </section>
  );
}
