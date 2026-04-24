import Link from "next/link";

export default function LandingPage() {
  return (
    <section className="panel hero">
      <div className="eyebrow">Finance AI workspace</div>
      <div className="hero-grid">
        <div className="hero-copy">
          <h1>Minimal finance tracking, with the assistant always within reach.</h1>
          <p className="hero-lead">
            FinAgent keeps the ledger clean and focused, then layers in AI for imports, trend summaries, and fast
            follow-up questions when you need more context.
          </p>
          <div className="hero-proof">
            <span className="hero-proof-item">Manual expense logging</span>
            <span className="hero-proof-item">Receipt and file import</span>
            <span className="hero-proof-item">AI spending insights</span>
            <span className="hero-proof-item">Embedded assistant</span>
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
              <span className="hero-stat-label">Capture</span>
              <strong>Log every spend</strong>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-label">Import</span>
              <strong>Pull from receipts</strong>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-label">Ask</span>
              <strong>Chat for quick answers</strong>
            </div>
          </div>
        </div>

        <aside className="surface-note">
          <span className="meta">Workspace preview</span>
          <div className="surface-stack">
            <div className="card-title">A focused control room for spending, imports, and AI help.</div>
            <p className="muted">
              The layout stays calm and structured like a modern finance product, while the assistant sits close to the
              main workflow instead of feeling bolted on.
            </p>
          </div>
          <div className="assistant-preview">
            <div className="assistant-preview-head">
              <span className="item-pill ai">FinAgent assistant</span>
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
            <div className="topology-item">Open Insights or ask the assistant for a quick read.</div>
          </div>
        </aside>
      </div>
    </section>
  );
}
