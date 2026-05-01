 "use client";

import Link from "next/link";

import { BRAND } from "@/src/constants/branding.js";
import { useAuth } from "@/src/state/AuthContext.jsx";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <section className="landing-stack">
      <section className="panel hero hero-business">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">Business expense management</div>
            <h1>Run company spend in one operational workspace built for control and auditability.</h1>
            <p className="hero-lead">
              {BRAND.name} helps teams capture expenses, import source documents, review analytics, and ask for fast
              operational guidance without adding process noise.
            </p>
            <div className="hero-proof">
              <span className="hero-proof-item">Expense capture</span>
              <span className="hero-proof-item">Document intake</span>
              <span className="hero-proof-item">Operational analytics</span>
              <span className="hero-proof-item">{BRAND.assistantRole}</span>
            </div>
            <div className="hero-actions">
              <Link className="button" href="/signup">
                Create Workspace
              </Link>
              <Link className="button ghost" href={user ? "/dashboard" : "/signin"}>
                {user ? "Open Expenses" : "Sign In"}
              </Link>
            </div>
          </div>

          <aside className="hero-side-stack">
            <div className="surface-note">
              <span className="meta">Workspace preview</span>
              <div className="surface-stack">
                <div className="card-title">A structured control center for company spend and review workflows.</div>
                <p className="muted">
                  The interface keeps expense operations efficient while giving {BRAND.name} a natural place to support
                  imports, summaries, and executive follow-up questions.
                </p>
              </div>
              <div className="summary-strip">
                <span className="summary-chip">Company-facing</span>
                <span className="summary-chip">Executive-readable</span>
                <span className="summary-chip">Operationally efficient</span>
              </div>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-label">Workflow 01</span>
                <strong>Capture and classify expense activity</strong>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-label">Workflow 02</span>
                <strong>Import invoices and supporting files</strong>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-label">Workflow 03</span>
                <strong>Review analytics and ask the advisor</strong>
              </div>
            </div>

            <div className="assistant-preview">
              <div className="assistant-preview-head">
                <span className="item-pill ai">{BRAND.assistantName}</span>
                <span className="meta">Advisor workflow</span>
              </div>
              <div className="assistant-preview-body">
                <div className="assistant-preview-bubble">Which category moved the most this month?</div>
                <div className="assistant-preview-bubble assistant">
                  Marketing increased the most. Open Expense Analytics for the broader operating trend.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="landing-grid">
        <section className="panel dashboard-section stack">
          <div>
            <div className="eyebrow">Operating model</div>
            <h2 className="card-title">A clean workflow for finance, operations, and founders</h2>
          </div>
          <div className="chain-timeline">
            <div className="timeline-item">
              <span className="timeline-node">01</span>
              <div className="timeline-copy">Use the expense workspace to capture operating spend as it happens.</div>
            </div>
            <div className="timeline-item">
              <span className="timeline-node">02</span>
              <div className="timeline-copy">Upload invoices, receipts, or exports to extract likely expense records.</div>
            </div>
            <div className="timeline-item">
              <span className="timeline-node">03</span>
              <div className="timeline-copy">Import the extracted records you want added to company history.</div>
            </div>
            <div className="timeline-item">
              <span className="timeline-node">04</span>
              <div className="timeline-copy">Open Expense Analytics or ask the advisor for a concise operating readout.</div>
            </div>
          </div>
        </section>

        <section className="panel dashboard-section stack corner-accent">
          <div>
            <div className="eyebrow">Why it works</div>
            <h2 className="card-title">Business-ready by design</h2>
          </div>
          <div className="feature-list">
            <div className="feature-item">
              <strong>Structured capture</strong>
              <span className="muted">Keep expense intake, categorization, and source import in a single operational lane.</span>
            </div>
            <div className="feature-item">
              <strong>Executive-readable analytics</strong>
              <span className="muted">Turn recent records into a concise brief that is easy to review with stakeholders.</span>
            </div>
            <div className="feature-item">
              <strong>Advisor support on demand</strong>
              <span className="muted">Ask direct questions about expense activity without disrupting the core workflow.</span>
            </div>
          </div>
        </section>
      </section>
    </section>
  );
}
