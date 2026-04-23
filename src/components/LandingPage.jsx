import Link from "next/link";

export default function LandingPage() {
  return (
    <section className="panel hero">
      <div className="eyebrow">Premium finance command center</div>
      <div className="hero-grid">
        <div className="hero-copy">
          <h1>See every rupee move through a calmer, sharper finance workspace.</h1>
          <p className="hero-lead">
            FinAgent gives you a single secure surface for capture, review, and AI-assisted insight. The
            frontend stays public and polished, while auth, expense, insight, and chat traffic remains private
            behind the edge.
          </p>
          <div className="hero-proof">
            <span className="hero-proof-item">Fast capture</span>
            <span className="hero-proof-item">Private proxy routing</span>
            <span className="hero-proof-item">AI-guided review</span>
          </div>
          <div className="hero-actions">
            <Link className="button" href="/signup">
              Open Workspace
            </Link>
            <Link className="button ghost" href="/signin">
              Sign In
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-label">Session boundary</span>
              <strong>HTTP-only</strong>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-label">Private traffic</span>
              <strong>Cluster only</strong>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-label">AI assistance</span>
              <strong>Always nearby</strong>
            </div>
          </div>
        </div>

        <aside className="surface-note">
          <span className="meta">Runtime topology</span>
          <div className="surface-stack">
            <div className="card-title">Designed like a premium product. Routed like hardened infrastructure.</div>
            <p className="muted">
              Your browser only talks to the frontend surface. Every backend call is forwarded server-side so the
              app feels fast, controlled, and private.
            </p>
          </div>
          <div className="summary-strip">
            <span className="summary-chip">HAProxy</span>
            <span className="summary-chip">kgateway</span>
            <span className="summary-chip">Next.js</span>
            <span className="summary-chip">internal services</span>
          </div>
          <p className="muted">
            The browser never needs Kubernetes DNS and the backend services do not need external routes to
            function.
          </p>
          <div className="topology-list">
            <code className="topology-item">auth-service.finagent-apps.svc.cluster.local</code>
            <code className="topology-item">expense-service.finagent-apps.svc.cluster.local</code>
            <code className="topology-item">insights-service.finagent-apps.svc.cluster.local</code>
            <code className="topology-item">chat-service.finagent-apps.svc.cluster.local</code>
          </div>
        </aside>
      </div>
    </section>
  );
}
