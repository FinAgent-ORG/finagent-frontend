"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import ChatDrawer from "@/src/components/ChatDrawer.jsx";
import { BRAND } from "@/src/constants/branding.js";
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

  function navStatusLabel() {
    if (pathname === "/") {
      return "Platform overview";
    }
    if (pathname === "/signin") {
      return "Workspace access";
    }
    if (pathname === "/signup") {
      return "Provision workspace";
    }
    if (pathname === "/dashboard") {
      return "Expense operations";
    }
    if (pathname === "/insights") {
      return "Expense analytics";
    }
    return pathname.replace("/", "") || "Workspace";
  }

  const titleByPath = {
    "/": "Business expense management",
    "/dashboard": "Expense operations center",
    "/insights": "Expense analytics brief",
    "/signin": "Secure workspace access",
    "/signup": "Create company workspace",
  };

  return (
    <div className="shell">
      <div className="page app-layout">
        <aside className="panel app-sidebar">
          <div className="sidebar-section">
            <Link className="brand" href="/">
              <span className="brand-mark fa-mark" aria-hidden="true">
                <span className="fa-mark-f">N</span>
                <span className="fa-mark-a">F</span>
              </span>
              <span className="brand-copy">
                <span className="brand-label">Expense operations</span>
                <span className="brand-name">{BRAND.name}</span>
              </span>
            </Link>
            <p className="sidebar-copy">
              Company expense capture, analytics, and advisor workflows in one operational workspace.
            </p>
          </div>

          <nav className="sidebar-nav">
            <Link className={navClass("/")} href="/">
              <span className="nav-link-kicker">01</span>
              <span>
                <strong>Overview</strong>
                <small>Platform and workflow summary</small>
              </span>
            </Link>
            {user ? (
              <>
                <Link className={navClass("/dashboard")} href="/dashboard">
                  <span className="nav-link-kicker">02</span>
                  <span>
                    <strong>Expenses</strong>
                    <small>Capture, import, and review activity</small>
                  </span>
                </Link>
                <Link className={navClass("/insights")} href="/insights">
                  <span className="nav-link-kicker">03</span>
                  <span>
                    <strong>Analytics</strong>
                    <small>Executive brief and recommendations</small>
                  </span>
                </Link>
              </>
            ) : null}
          </nav>

          <div className="sidebar-section sidebar-section-fill">
            <div className="sidebar-card">
              <span className="sidebar-card-label">Workspace state</span>
              <strong>{user ? "Authenticated session" : "Visitor session"}</strong>
              <p className="muted">
                {user
                  ? "Your expense records, analytics, and advisor requests stay scoped to the active account."
                  : "Sign in to access expense operations, analytics, and the advisor."}
              </p>
            </div>
          </div>

          <div className="sidebar-footer">
            {user ? (
              <>
                <span className="user-pill meta">{user.email}</span>
                <button className="button secondary sidebar-button" onClick={handleSignout} type="button">
                  Sign Out
                </button>
              </>
            ) : loading ? (
              <span className="meta">Checking workspace access</span>
            ) : (
              <div className="sidebar-actions">
                <Link className="button secondary" href="/signin">
                  Sign In
                </Link>
                <Link className="button" href="/signup">
                  Create Workspace
                </Link>
              </div>
            )}
          </div>
        </aside>

        <div className="app-main">
          <header className="panel topbar">
            <div className="topbar-copy">
              <span className="eyebrow eyebrow-compact">{navStatusLabel()}</span>
              <h1 className="topbar-title">{titleByPath[pathname] ?? "NexaFlow workspace"}</h1>
            </div>
            <div className="topbar-actions">
              <span className="nav-status meta">{user ? "Secure account scope" : "Public workspace view"}</span>
              {user ? (
                <span className="summary-chip">Advisor available</span>
              ) : (
                <span className="summary-chip">Read-only overview</span>
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
      <ChatDrawer />
    </div>
  );
}
