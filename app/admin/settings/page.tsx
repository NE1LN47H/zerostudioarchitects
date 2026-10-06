"use client";

import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import { SiteSettings } from "@/lib/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data.settings);
        }
      } catch {
        showToast("Error loading site settings");
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showToast("Site settings saved successfully");
      } else {
        showToast("Failed to save settings");
      }
    } catch {
      showToast("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div style={{ padding: "40px", color: "#666" }}>Loading Settings...</div>;
  }

  return (
    <div>
      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Site Configuration & SEO</h1>
          <p className={styles.pageSubtitle}>
            Global website metadata, branding assets, and social channels
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Global Brand & SEO Identity</h2>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Default Website Title</label>
            <input
              type="text"
              className={styles.input}
              value={settings.siteTitle}
              onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Default Meta Description</label>
            <textarea
              className={styles.textarea}
              rows={3}
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Logo Asset Path / URL</label>
              <input
                type="text"
                className={styles.input}
                value={settings.logoUrl}
                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Favicon URL</label>
              <input
                type="text"
                className={styles.input}
                value={settings.faviconUrl || "/favicon.ico"}
                onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Default Social Share (Open Graph) Image URL</label>
            <input
              type="text"
              className={styles.input}
              value={settings.defaultOgImage || ""}
              onChange={(e) => setSettings({ ...settings, defaultOgImage: e.target.value })}
            />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Social Handles</h2>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Instagram URL</label>
              <input
                type="url"
                className={styles.input}
                value={settings.instagramUrl}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Facebook URL</label>
              <input
                type="url"
                className={styles.input}
                value={settings.facebookUrl}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "40px" }}>
          <button
            type="submit"
            className={`${styles.btn} ${styles.btnPrimary}`}
            disabled={saving}
          >
            {saving ? "Saving Changes..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
