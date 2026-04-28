 "use client";

import Link from "next/link";

import { BRAND } from "@/src/constants/branding.js";
import { useAuth } from "@/src/state/AuthContext.jsx";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <section className="panel hero">
      <div className="eyebrow">Enterprise expense operations</div>
      <div className="hero-grid">
        <div className="hero-copy">
          <h1>
            Run company spend in one executive workspace built for
            {" "}
            <span className="gradient-text">operational clarity.</span>
          </h1>
          <p className="hero-lead">
            {BRAND.name}
            {" "}
            helps companies capture expenses, import supporting files, review spend intelligence, and ask for fast
            operational guidance without adding process noise.
          </p>
          <div className="hero-proof">
            <span className="hero-proof-item">Company expense capture</span>
            <span className="hero-proof-item">Invoice and file import</span>
            <span className="hero-proof-item">Operational spend intelligence</span>
            <span className="hero-proof-item">{BRAND.assistantRole}</span>
          </div>
          <div className="hero-actions">
            <Link className="button" href="/signup">
              Start NexaFlow
            </Link>
            <Link className="button ghost" href={user ? "/dashboard" : "/signin"}>
              {user ? "Open Dashboard" : "Sign In"}
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-label">Step 01</span>
              <strong>Record company spend</strong>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-label">Step 02</span>
              <strong>Import source files</strong>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-label">Step 03</span>
              <strong>Ask the advisor</strong>
            </div>
          </div>
        </div>

        <aside className="surface-note">
          <span className="meta">Platform preview</span>
          <div className="surface-stack">
            <div className="card-title">A polished control center for company spend, approvals, and business intelligence.</div>
            <p className="muted">
              The interface keeps the core workflow efficient while giving
              {" "}
              {BRAND.name}
              {" "}
              a natural place to support imports, summaries, and executive follow-up questions.
            </p>
          </div>
          <div className="hero-orbit" aria-hidden="true">
            <div className="hero-orbit-core" />
            <div className="hero-orbit-ring outer" />
            <div className="hero-orbit-ring inner" />
            <div className="orbit-card orbit-card-top">
              <span className="orbit-card-label">Operations</span>
              <strong>Spend always visible</strong>
            </div>
            <div className="orbit-card orbit-card-right">
              <span className="orbit-card-label">Intelligence</span>
              <strong>Executive-ready</strong>
            </div>
            <div className="orbit-card orbit-card-bottom">
              <span className="orbit-card-label">{BRAND.name}</span>
              <strong>Advisor on demand</strong>
            </div>
          </div>
          <div className="assistant-preview">
            <div className="assistant-preview-head">
              <span className="item-pill ai">{BRAND.assistantName}</span>
              <span className="meta">Live advisor</span>
            </div>
            <div className="assistant-preview-body">
              <div className="assistant-preview-bubble">
                Which cost center moved the most this month?
              </div>
              <div className="assistant-preview-bubble assistant">
                Marketing increased the most. Open Business Intelligence for the wider operating trend.
              </div>
            </div>
          </div>
          <div className="summary-strip">
            <span className="summary-chip">Dashboard for operations</span>
            <span className="summary-chip">Intelligence for review</span>
            <span className="summary-chip">Advisor for questions</span>
          </div>
          <p className="muted">
            Start by recording a few company expenses. Once activity builds up, the intelligence view and advisor become
            much more valuable.
          </p>
          <div className="chain-timeline">
            <div className="timeline-item">
              <span className="timeline-node">01</span>
              <div className="timeline-copy">Use the dashboard to capture operational spend as it happens.</div>
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
              <div className="timeline-copy">Open Business Intelligence or ask the advisor for a quick operating readout.</div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
