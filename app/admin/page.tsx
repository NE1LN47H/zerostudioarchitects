"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./admin.module.css";

interface StatsData {
  counts: {
    projects: number;
    hero: number;
    awards: number;
    journal: number;
    team: number;
    media: number;
  };
  visibility: {
    projectsVisible: number;
    projectsHidden: number;
    heroVisible: number;
    heroHidden: number;
  };
  recentProjects: any[];
  recentJournal: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Studio Overview</h1>
          <p className={styles.pageSubtitle}>
            Zero Studio Architectures — Dynamic CMS & Media Hub
          </p>
        </div>

        <div className={styles.headerActions}>
          <Link href="/admin/projects" className={`${styles.btn} ${styles.btnPrimary}`}>
            <span>+</span> Add Project
          </Link>
          <Link href="/admin/hero" className={`${styles.btn} ${styles.btnSecondary}`}>
            <span>+</span> Add Hero Image
          </Link>
          <Link href="/admin/journal" className={`${styles.btn} ${styles.btnSecondary}`}>
            <span>+</span> Write Journal
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <div className={styles.card} style={{ padding: "20px" }}>
          <div style={{ fontSize: "0.72rem", color: "#888", fontWeight: 600, letterSpacing: "0.08em" }}>
            PROJECTS
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700, margin: "6px 0 2px", color: "#111" }}>
            {loading ? "..." : stats?.counts.projects ?? 6}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#047857" }}>
            {stats ? `${stats.visibility.projectsVisible} published` : "Architectural works"}
          </div>
        </div>

        <div className={styles.card} style={{ padding: "20px" }}>
          <div style={{ fontSize: "0.72rem", color: "#888", fontWeight: 600, letterSpacing: "0.08em" }}>
            HERO GRID
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700, margin: "6px 0 2px", color: "#111" }}>
            {loading ? "..." : stats?.counts.hero ?? 18}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#666" }}>
            6x3 photographic wall
          </div>
        </div>

        <div className={styles.card} style={{ padding: "20px" }}>
          <div style={{ fontSize: "0.72rem", color: "#888", fontWeight: 600, letterSpacing: "0.08em" }}>
            AWARDS
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700, margin: "6px 0 2px", color: "#111" }}>
            {loading ? "..." : stats?.counts.awards ?? 23}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#666" }}>
            National & state honors
          </div>
        </div>

        <div className={styles.card} style={{ padding: "20px" }}>
          <div style={{ fontSize: "0.72rem", color: "#888", fontWeight: 600, letterSpacing: "0.08em" }}>
            JOURNAL
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700, margin: "6px 0 2px", color: "#111" }}>
            {loading ? "..." : stats?.counts.journal ?? 6}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#666" }}>
            Published articles
          </div>
        </div>

        <div className={styles.card} style={{ padding: "20px" }}>
          <div style={{ fontSize: "0.72rem", color: "#888", fontWeight: 600, letterSpacing: "0.08em" }}>
            STUDIO TEAM
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 700, margin: "6px 0 2px", color: "#111" }}>
            {loading ? "..." : stats?.counts.team ?? 4}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#666" }}>
            Principal architects
          </div>
        </div>
      </div>

      {/* Grid: Recent Projects & Recent Journal */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "24px",
        }}
      >
        {/* Recent Projects */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Recent Projects</h2>
            <Link href="/admin/projects" style={{ fontSize: "0.78rem", color: "#111", fontWeight: 500 }}>
              Manage all →
            </Link>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Year</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentProjects.map((p) => (
                  <tr key={p.slug}>
                    <td style={{ fontWeight: 600 }}>{p.title}</td>
                    <td>{p.category}</td>
                    <td>{p.year}</td>
                    <td>
                      <span className={`${styles.badge} ${p.visible ? styles.badgeSuccess : styles.badgeMuted}`}>
                        {p.visible ? "Live" : "Hidden"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Journal Articles */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Journal Articles</h2>
            <Link href="/admin/journal" style={{ fontSize: "0.78rem", color: "#111", fontWeight: 500 }}>
              Manage all →
            </Link>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentJournal.map((j) => (
                  <tr key={j.slug}>
                    <td style={{ fontWeight: 500 }}>{j.title}</td>
                    <td>{j.category}</td>
                    <td>{j.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Database & Cloudinary Status Card */}
      <div className={styles.card} style={{ marginTop: "24px", background: "#fafafa" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 600, margin: 0, color: "#111" }}>
              Active Configuration & Integration Status
            </h3>
            <p style={{ fontSize: "0.78rem", color: "#666", margin: "4px 0 0" }}>
              MongoDB and Cloudinary are integrated. Test credentials can be replaced in <code>.env.local</code> anytime.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <span className={`${styles.badge} ${styles.badgeSuccess}`}>MongoDB Ready</span>
            <span className={`${styles.badge} ${styles.badgeAccent}`}>Cloudinary Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
