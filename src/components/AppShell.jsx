"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAppError } from "@/src/state/AppErrorContext.jsx";
import { useAuth } from "@/src/state/AuthContext.jsx";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { error, setError } = useAppError();
  const { loading, signout, user } = useAuth();

  async function handleSignout() {
    await signout();
    setError("");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="shell">
      <div className="page">
        <header className="panel nav">
          <Link className="brand" href="/">
            FinAgent
          </Link>
          <nav className="nav-links">
            <Link className="nav-link" href="/">
              Home
            </Link>
            {user ? (
              <Link className="nav-link" href="/dashboard">
                Dashboard
              </Link>
            ) : null}
            {pathname === "/dashboard" ? <span className="meta">/dashboard</span> : null}
          </nav>
          <div className="nav-actions">
            {user ? (
              <button className="button secondary" onClick={handleSignout} type="button">
                Sign Out
              </button>
            ) : loading ? (
              <span className="meta">Checking session</span>
            ) : (
              <>
                <Link className="nav-link" href="/signin">
                  Sign In
                </Link>
                <Link className="button" href="/signup">
                  Create Account
                </Link>
              </>
            )}
          </div>
        </header>

        {error ? (
          <div className="banner">
            <span>{error}</span>
            <button className="button secondary" onClick={() => setError("")} type="button">
              Dismiss
            </button>
          </div>
        ) : null}

        {children}
      </div>
    </div>
  );
}
