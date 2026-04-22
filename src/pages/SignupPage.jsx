import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { authApi } from "../lib/api";
import { sanitizeText } from "../lib/sanitize";
import { useAppError } from "../state/AppErrorContext";
import { useAuth } from "../state/AuthContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signin } = useAuth();
  const { setError } = useAppError();
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = await authApi.signup({ email: form.email, password: form.password });
      signin(payload);
      navigate("/dashboard");
    } catch (error) {
      setError(sanitizeText(error.message));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="panel auth-card page" style={{ maxWidth: 560 }}>
      <h1>Create Account</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            required
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            minLength={12}
            required
          />
        </label>
        <label className="field">
          <span>Confirm Password</span>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
            minLength={12}
            required
          />
        </label>
        <button className="button" disabled={submitting} type="submit">
          {submitting ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </section>
  );
}
