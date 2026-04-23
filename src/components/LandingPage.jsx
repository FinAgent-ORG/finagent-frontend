import Link from "next/link";

export default function LandingPage() {
  return (
    <section className="panel hero">
      <div className="eyebrow">Single edge, private services</div>
      <div className="hero-grid">
        <div className="hero-copy">
          <h1>Secure spending intelligence routed through one hardened frontend.</h1>
          <p>
            FinAgent now runs with a single public entrypoint. Users hit the frontend through HAProxy and
            kgateway, while all auth, expense, insight, and chat traffic stays private inside the cluster.
          </p>
          <div className="nav-actions">
            <Link className="button" href="/signup">
              Start Free
            </Link>
            <Link className="button secondary" href="/signin">
              Sign In
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-label">Public path</span>
              <strong>Frontend only</strong>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-label">Cluster calls</span>
              <strong>Service DNS only</strong>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-label">Session model</span>
              <strong>HTTP-only cookie</strong>
            </div>
          </div>
        </div>

        <aside className="surface-note">
          <span className="meta">Runtime topology</span>
          <div className="card-title">
            HAProxy {"->"} kgateway {"->"} Next.js frontend {"->"} internal services
          </div>
          <p className="muted">
            The browser never needs Kubernetes DNS and the backend services do not need external routes to
            function.
          </p>
          <code>auth-service.finagent-apps.svc.cluster.local</code>
          <code>expense-service.finagent-apps.svc.cluster.local</code>
          <code>insights-service.finagent-apps.svc.cluster.local</code>
          <code>chat-service.finagent-apps.svc.cluster.local</code>
        </aside>
      </div>
    </section>
  );
}
