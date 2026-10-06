"use client";

import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import { AboutContent } from "@/lib/types";

export default function AdminAboutPage() {
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    async function loadAbout() {
      try {
        const res = await fetch("/api/admin/about");
        if (res.ok) {
          const data = await res.json();
          setAbout(data.about);
        }
      } catch {
        showToast("Error loading about content");
      } finally {
        setLoading(false);
      }
    }
    loadAbout();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!about) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(about),
      });
      if (res.ok) {
        showToast("About content updated successfully");
      } else {
        showToast("Failed to save changes");
      }
    } catch {
      showToast("Error saving content");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !about) {
    return <div style={{ padding: "40px", color: "#666" }}>Loading About CMS...</div>;
  }

  return (
    <div>
      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>About Studio Section</h1>
          <p className={styles.pageSubtitle}>
            Edit introductory narrative, studio philosophy, and leadership details
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Editorial Headings & Philosophy</h2>
            <span style={{ fontSize: "0.75rem", color: "#666" }}>
              Appears on Page 02 with sequential word reveal animation
            </span>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Section Heading</label>
            <input
              type="text"
              className={styles.input}
              value={about.heading}
              onChange={(e) => setAbout({ ...about, heading: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Page 02 Main Reveal Paragraph (Word-by-word animation)
            </label>
            <textarea
              className={styles.textarea}
              rows={4}
              value={about.paragraph1}
              onChange={(e) => setAbout({ ...about, paragraph1: e.target.value })}
              required
            />
            <div style={{ fontSize: "0.72rem", color: "#888", marginTop: "4px" }}>
              This paragraph is displayed prominently on Section 02 of the homepage and animates sequentially.
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Secondary Philosophy Paragraph (Modal & Extended View)
            </label>
            <textarea
              className={styles.textarea}
              rows={5}
              value={about.paragraph2}
              onChange={(e) => setAbout({ ...about, paragraph2: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Lead Architects / Founders Mention</label>
            <input
              type="text"
              className={styles.input}
              value={about.leadArchitects || ""}
              onChange={(e) => setAbout({ ...about, leadArchitects: e.target.value })}
            />
          </div>
        </div>

        {/* Studio Key Figures / Statistics */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Studio Milestones & Statistics</h2>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}
              onClick={() => {
                const updatedStats = [...(about.stats || []), { label: "New Metric", value: "0" }];
                setAbout({ ...about, stats: updatedStats });
              }}
            >
              + Add Metric
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            {about.stats?.map((stat, sIdx) => (
              <div
                key={sIdx}
                style={{
                  border: "1px solid #ebebeb",
                  borderRadius: "6px",
                  padding: "14px",
                  background: "#fafafa",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <label className={styles.label} style={{ margin: 0 }}>Metric #{sIdx + 1}</label>
                  <button
                    type="button"
                    style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: "0.75rem" }}
                    onClick={() => {
                      const updatedStats = about.stats?.filter((_, idx) => idx !== sIdx);
                      setAbout({ ...about, stats: updatedStats });
                    }}
                  >
                    Remove
                  </button>
                </div>

                <div className={styles.formGroup} style={{ marginBottom: "8px" }}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Value (e.g. 2013, 25+)"
                    value={stat.value}
                    onChange={(e) => {
                      const updated = [...(about.stats || [])];
                      updated[sIdx].value = e.target.value;
                      setAbout({ ...about, stats: updated });
                    }}
                  />
                </div>

                <input
                  type="text"
                  className={styles.input}
                  placeholder="Label (e.g. Founded, Citations)"
                  value={stat.label}
                  onChange={(e) => {
                    const updated = [...(about.stats || [])];
                    updated[sIdx].label = e.target.value;
                    setAbout({ ...about, stats: updated });
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "40px" }}>
          <button
            type="submit"
            className={`${styles.btn} ${styles.btnPrimary}`}
            disabled={saving}
          >
            {saving ? "Saving Changes..." : "Save About Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
