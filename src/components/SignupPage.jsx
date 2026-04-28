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
        <div className="eyebrow">New company workspace</div>
        <h1>
          Create company access and start managing
          {" "}
          <span className="gradient-text">company spend clearly.</span>
        </h1>
        <p className="muted">
          Set up company access to begin recording company expenses, importing source files, reviewing AI summaries, and
          asking for quick operating guidance whenever clarity is needed.
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
            {isPending ? "Creating access..." : "Create Workspace"}
          </button>
        </form>
      </section>
      <aside className="panel auth-aside">
        <div className="eyebrow">How it works</div>
        <h2 className="card-title">Start with operations, then use AI where it adds value.</h2>
        <p className="muted">
          Begin with company expense history. Once data is flowing, the intelligence page and advisor help interpret it
          faster without crowding the core workflow.
        </p>
        <div className="summary-strip">
          <span className="summary-chip">Create workspace</span>
          <span className="summary-chip">Add first records</span>
          <span className="summary-chip">Ask the advisor</span>
        </div>
        <div className="feature-list">
          <div className="feature-item corner-accent">
            <strong>Manual and imported records</strong>
            <span className="muted">Log company expenses directly or upload files to extract likely expense records.</span>
          </div>
          <div className="feature-item corner-accent">
            <strong>Dedicated intelligence lane</strong>
            <span className="muted">Use the intelligence page when you want summaries, patterns, and recommendations.</span>
          </div>
        </div>
      </aside>
    </section>
  );
}
