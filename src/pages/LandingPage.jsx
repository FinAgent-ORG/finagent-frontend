import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <section className="panel hero">
      <h1>Secure spending intelligence, split into focused services.</h1>
      <p>
        This frontend now talks only to versioned backend APIs for auth, expenses, insights, and chat.
        No browser-side database logic, no direct data store access, and clearer domain boundaries.
      </p>
      <div className="nav-actions">
        <Link className="button" to="/signup">
          Start Free
        </Link>
        <Link className="button secondary" to="/signin">
          Sign In
        </Link>
      </div>
    </section>
  );
}
