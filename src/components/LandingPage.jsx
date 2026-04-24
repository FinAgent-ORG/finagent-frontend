 "use client";

import Link from "next/link";

import { useAuth } from "@/src/state/AuthContext.jsx";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <section className="panel hero">
      <div className="eyebrow">Smart expense tracking</div>
      <div className="hero-grid">
        <div className="hero-copy">
          <h1>
            Track spending in one focused workspace built for
            {" "}
            <span className="gradient-text">everyday clarity.</span>
          </h1>
          <p className="hero-lead">
            FinAgent helps you log expenses, import receipts, review patterns, and ask quick follow-up questions
            without making the product feel noisy or overcomplicated.
          </p>
          <div className="hero-proof">
            <span className="hero-proof-item">Manual expense logging</span>
            <span className="hero-proof-item">Receipt and file import</span>
            <span className="hero-proof-item">AI spending insights</span>
            <span className="hero-proof-item">FinAgent chat</span>
          </div>
          <div className="hero-actions">
            <Link className="button" href="/signup">
              Get Started
            </Link>
            <Link className="button ghost" href={user ? "/dashboard" : "/signin"}>
              {user ? "Signed In" : "Sign In"}
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-label">Step 01</span>
              <strong>Add expenses</strong>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-label">Step 02</span>
              <strong>Import receipts</strong>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-label">Step 03</span>
              <strong>Ask FinAgent</strong>
            </div>
          </div>
        </div>

        <aside className="surface-note">
          <span className="meta">Product preview</span>
          <div className="surface-stack">
            <div className="card-title">A cleaner place to capture spending and get useful help from FinAgent.</div>
            <p className="muted">
              The interface keeps the main workflow straightforward while giving FinAgent a natural place to help with
              imports, summaries, and quick questions.
            </p>
          </div>
          <div className="hero-orbit" aria-hidden="true">
            <div className="hero-orbit-core" />
            <div className="hero-orbit-ring outer" />
            <div className="hero-orbit-ring inner" />
            <div className="orbit-card orbit-card-top">
              <span className="orbit-card-label">Expenses</span>
              <strong>Always visible</strong>
            </div>
            <div className="orbit-card orbit-card-right">
              <span className="orbit-card-label">Insights</span>
              <strong>Easy to review</strong>
            </div>
            <div className="orbit-card orbit-card-bottom">
              <span className="orbit-card-label">FinAgent</span>
              <strong>Ready to help</strong>
            </div>
          </div>
          <div className="assistant-preview">
            <div className="assistant-preview-head">
              <span className="item-pill ai">FinAgent AI</span>
              <span className="meta">Live companion</span>
            </div>
            <div className="assistant-preview-body">
              <div className="assistant-preview-bubble">
                Which category moved the most this month?
              </div>
              <div className="assistant-preview-bubble assistant">
                Groceries increased the most. Open Insights for the broader pattern.
              </div>
            </div>
          </div>
          <div className="summary-strip">
            <span className="summary-chip">Dashboard for logging</span>
            <span className="summary-chip">Insights for analysis</span>
            <span className="summary-chip">FinAgent for questions</span>
          </div>
          <p className="muted">
            Start by adding a few expenses. Once your data builds up, the insights view and FinAgent become much more
            useful.
          </p>
          <div className="chain-timeline">
            <div className="timeline-item">
              <span className="timeline-node">01</span>
              <div className="timeline-copy">Use the Dashboard to add expenses one by one.</div>
            </div>
            <div className="timeline-item">
              <span className="timeline-node">02</span>
              <div className="timeline-copy">Upload a receipt or export file to extract likely entries.</div>
            </div>
            <div className="timeline-item">
              <span className="timeline-node">03</span>
              <div className="timeline-copy">Import the extracted items you want to keep.</div>
            </div>
            <div className="timeline-item">
              <span className="timeline-node">04</span>
              <div className="timeline-copy">Open Insights or ask FinAgent for a quick read.</div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
