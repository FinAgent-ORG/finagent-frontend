"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import ChatDrawer from "@/src/components/ChatDrawer.jsx";
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

  function navClass(target) {
    return pathname === target ? "nav-link active" : "nav-link";
  }

  return (
    <div className="shell">
      <div className="page">
        <header className="panel nav">
          <Link className="brand" href="/">
            <span className="brand-mark" aria-hidden="true" />
            <span className="brand-copy">
              <span className="brand-label">Personal finance OS</span>
              <span className="brand-name">FinAgent</span>
            </span>
          </Link>
          <nav className="nav-links">
            <Link className={navClass("/")} href="/">
              Home
            </Link>
            {user ? (
              <>
                <Link className={navClass("/dashboard")} href="/dashboard">
                  Dashboard
                </Link>
                <Link className={navClass("/insights")} href="/insights">
                  Insights
                </Link>
              </>
            ) : null}
            {pathname === "/dashboard" || pathname === "/insights" ? (
              <span className="nav-status meta">{pathname.replace("/", "")}</span>
            ) : null}
          </nav>
          <div className="nav-actions">
            {user ? (
              <>
                <span className="user-pill meta">{user.email}</span>
                <button className="button secondary" onClick={handleSignout} type="button">
                  Sign Out
                </button>
              </>
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
      <ChatDrawer />
    </div>
  );
}
