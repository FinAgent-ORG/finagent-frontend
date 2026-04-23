import Link from "next/link";

export default function LandingPage() {
  return (
    <section className="panel hero">
      <div className="eyebrow">Personal finance assistant</div>
      <div className="hero-grid">
        <div className="hero-copy">
          <h1>Track expenses, turn receipts into entries, and get useful spending insights.</h1>
          <p className="hero-lead">
            FinAgent helps you keep a simple personal money workflow in one place. Add expenses manually, upload
            receipts or exports to extract entries, and use AI-generated summaries to understand what changed in
            your spending.
          </p>
          <div className="hero-proof">
            <span className="hero-proof-item">Manual expense logging</span>
            <span className="hero-proof-item">Receipt and file import</span>
            <span className="hero-proof-item">AI spending insights</span>
          </div>
          <div className="hero-actions">
            <Link className="button" href="/signup">
              Get Started
            </Link>
            <Link className="button ghost" href="/signin">
              Sign In
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-label">Step 1</span>
              <strong>Log expenses</strong>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-label">Step 2</span>
              <strong>Import receipts</strong>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-label">Step 3</span>
              <strong>Review insights</strong>
            </div>
          </div>
        </div>

        <aside className="surface-note">
          <span className="meta">How to use FinAgent</span>
          <div className="surface-stack">
            <div className="card-title">A simple workflow for understanding where your money goes.</div>
            <p className="muted">
              The app is built around three main jobs: recording expenses, reviewing extracted items before saving
              them, and checking the insights page for trends and suggestions.
            </p>
          </div>
          <div className="summary-strip">
            <span className="summary-chip">Dashboard for logging</span>
            <span className="summary-chip">Insights for analysis</span>
            <span className="summary-chip">Assistant for questions</span>
          </div>
          <p className="muted">
            If you are new here, create an account, add a few expenses, then open Insights to see summaries and
            recommendations based on your recent activity.
          </p>
          <div className="topology-list">
            <div className="topology-item">Use the Dashboard to add expenses one by one.</div>
            <div className="topology-item">Upload a receipt or export file to extract likely entries.</div>
            <div className="topology-item">Import the extracted items you want to keep.</div>
            <div className="topology-item">Open Insights to understand patterns and next actions.</div>
          </div>
        </aside>
      </div>
    </section>
  );
}
