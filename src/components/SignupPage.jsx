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
    <section className="panel auth-card">
      <div className="eyebrow">New workspace</div>
      <h1>Create an account without exposing backend services.</h1>
      <p className="muted">The frontend owns the session boundary and forwards auth requests privately inside the cluster.</p>
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
  );
}
