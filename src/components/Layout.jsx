import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../state/AuthContext";
import { useAppError } from "../state/AppErrorContext";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const { token, signout } = useAuth();
  const { error, setError } = useAppError();

  return (
    <div className="shell">
      <div className="page">
        <header className="panel nav">
          <Link className="brand" to="/">
            FinAgent
          </Link>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            {token ? <Link to="/dashboard">Dashboard</Link> : null}
          </nav>
          <div className="nav-actions">
            {token ? (
              <button
                className="button secondary"
                onClick={() => {
                  signout();
                  setError("");
                  navigate("/");
                }}
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link to="/signin">Sign In</Link>
                <Link className="button" to="/signup">
                  Create Account
                </Link>
              </>
            )}
          </div>
        </header>

        {error ? (
          <div className="banner">
            {error}{" "}
            <button className="button secondary" onClick={() => setError("")}>
              Dismiss
            </button>
          </div>
        ) : null}

        {children}
      </div>
    </div>
  );
}
