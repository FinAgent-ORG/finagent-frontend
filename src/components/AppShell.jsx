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
    if (pathname === "/dashboard") {
      return "business dashboard";
    }
    if (pathname === "/insights") {
      return "business intelligence";
    }
    return pathname.replace("/", "");
  }

  return (
    <div className="shell">
      <div className="page">
        <header className="panel nav">
          <Link className="brand" href="/">
            <span className="brand-mark fa-mark" aria-hidden="true">
              <span className="fa-mark-f">N</span>
              <span className="fa-mark-a">F</span>
            </span>
            <span className="brand-name">{BRAND.name}</span>
          </Link>
          <nav className="nav-links">
            <Link className={navClass("/")} href="/">
              Overview
            </Link>
            {user ? (
              <>
                <Link className={navClass("/dashboard")} href="/dashboard">
                  Dashboard
                </Link>
                <Link className={navClass("/insights")} href="/insights">
                  Intelligence
                </Link>
              </>
            ) : null}
            {pathname === "/dashboard" || pathname === "/insights" ? (
              <span className="nav-status meta">{navStatusLabel()}</span>
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
              <span className="meta">Checking company access</span>
            ) : (
              <>
                <Link className="nav-link" href="/signin">
                  Sign In
                </Link>
                <Link className="button" href="/signup">
                  Launch Workspace
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
