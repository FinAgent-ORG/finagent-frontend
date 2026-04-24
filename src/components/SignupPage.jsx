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
        <h1>Create your account and start tracking expenses.</h1>
        <p className="muted">
          Set up your account to begin logging expenses, importing receipts, and reviewing AI summaries.
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
        <div className="eyebrow">How it works</div>
        <h2 className="card-title">Start simple, then use AI where it adds value.</h2>
        <p className="muted">
          Begin with the ledger. Once you have data, the insights page and assistant can help you interpret it faster.
        </p>
        <div className="summary-strip">
          <span className="summary-chip">Create account</span>
          <span className="summary-chip">Add first expenses</span>
          <span className="summary-chip">Review insights</span>
        </div>
        <div className="feature-list">
          <div className="feature-item">
            <strong>Manual and imported entries</strong>
            <span className="muted">Log expenses directly or upload files to extract likely transactions.</span>
          </div>
          <div className="feature-item">
            <strong>Dedicated insights lane</strong>
            <span className="muted">Use the insights page when you want summaries, patterns, and suggestions.</span>
          </div>
        </div>
      </aside>
    </section>
  );
}
