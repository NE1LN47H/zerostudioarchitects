"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import styles from "./admin.module.css";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "⊞" },
  { href: "/admin/hero", label: "Hero Wall", icon: "▦" },
  { href: "/admin/projects", label: "Projects", icon: "◫" },
  { href: "/admin/about", label: "About Studio", icon: "◉" },
  { href: "/admin/awards", label: "Awards & Honors", icon: "◈" },
  { href: "/admin/journal", label: "Journal", icon: "▤" },
  { href: "/admin/team", label: "Studio Team", icon: "◬" },
  { href: "/admin/contact", label: "Contact Info", icon: "✉" },
  { href: "/admin/settings", label: "Site Settings", icon: "⚙" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ email: string } | null>(null);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
          if (isLoginPage) {
            router.push("/admin");
          }
        } else if (!isLoginPage) {
          router.push("/admin/login");
        }
      } catch {
        if (!isLoginPage) router.push("/admin/login");
      } finally {
        setAuthChecking(false);
      }
    }

    checkAuth();
  }, [pathname, isLoginPage, router]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  if (isLoginPage) {
    return <div className={styles.adminLayout}>{children}</div>;
  }

  if (authChecking) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#fbfbfb", fontSize: "0.85rem", color: "#666" }}>
        Loading Zero Studio CMS...
      </div>
    );
  }

  return (
    <div className={styles.adminLayout}>
      {/* Mobile Top Header */}
      <header className={styles.mobileHeader}>
        <div className={styles.brandWrap}>
          <Image src="/ZERO-LOGO.png" alt="Zero Studio" width={90} height={38} className={styles.brandLogo} />
          <span className={styles.brandBadge}>CMS</span>
        </div>
        <button
          type="button"
          className={styles.menuToggle}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile Backdrop */}
      <div
        className={`${styles.drawerOverlay} ${mobileOpen ? styles.open : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar Navigation */}
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ""}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.brandWrap}>
            <Image src="/ZERO-LOGO.png" alt="Zero Studio" width={110} height={42} className={styles.brandLogo} />
            <span className={styles.brandBadge}>CMS</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
              >
                <div className={styles.navLabelGroup}>
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.viewSiteLink}
          >
            <span>View Public Website</span>
            <span aria-hidden="true">↗</span>
          </a>

          <div className={styles.userRow}>
            <span className={styles.userEmail} title={currentUser?.email || "admin"}>
              {currentUser?.email || "admin@zerostudio.org"}
            </span>
            <button
              type="button"
              className={styles.logoutBtn}
              onClick={handleLogout}
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
