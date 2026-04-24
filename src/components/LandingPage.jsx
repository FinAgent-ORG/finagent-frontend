import Link from "next/link";

export default function LandingPage() {
  return (
    <section className="panel hero">
      <div className="eyebrow">AI expense tracking</div>
      <div className="hero-grid">
        <div className="hero-copy">
          <h1>Track expenses with a clean workflow and AI where it actually helps.</h1>
          <p className="hero-lead">
            FinAgent keeps expense logging straightforward, then adds AI for imports, summaries, and quick questions
            when you need them.
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
          <span className="meta">How it works</span>
          <div className="surface-stack">
            <div className="card-title">A focused workflow for tracking where your money goes.</div>
            <p className="muted">
              The product stays centered on the ledger. AI supports imports, summaries, and quick follow-up questions
              without taking over the whole interface.
            </p>
          </div>
          <div className="summary-strip">
            <span className="summary-chip">Dashboard for logging</span>
            <span className="summary-chip">Insights for analysis</span>
            <span className="summary-chip">Assistant for questions</span>
          </div>
          <p className="muted">
            Start by adding a few expenses. Once your ledger has activity, the insights and assistant become much more
            useful.
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
