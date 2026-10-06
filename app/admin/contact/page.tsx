"use client";

import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import { ContactInfo } from "@/lib/types";

export default function AdminContactPage() {
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    async function loadContact() {
      try {
        const res = await fetch("/api/admin/contact");
        if (res.ok) {
          const data = await res.json();
          setContact(data.contact);
        }
      } catch {
        showToast("Error loading contact details");
      } finally {
        setLoading(false);
      }
    }
    loadContact();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });
      if (res.ok) {
        showToast("Contact information updated successfully");
      } else {
        showToast("Failed to save contact information");
      }
    } catch {
      showToast("Error saving contact details");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !contact) {
    return <div style={{ padding: "40px", color: "#666" }}>Loading Contact CMS...</div>;
  }

  return (
    <div>
      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Contact & Studio Location</h1>
          <p className={styles.pageSubtitle}>
            Manage office details, enquiry emails, contact numbers, and social channels
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Contact Info"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Page 06 Contact Panel</h2>
            <span style={{ fontSize: "0.75rem", color: "#666" }}>
              Displayed on Section 06 & Site Footer
            </span>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Panel Heading</label>
              <input
                type="text"
                className={styles.input}
                value={contact.heading}
                onChange={(e) => setContact({ ...contact, heading: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Lead Subtitle</label>
              <input
                type="text"
                className={styles.input}
                value={contact.lead}
                onChange={(e) => setContact({ ...contact, lead: e.target.value })}
                required
              />
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Project Enquiries Email</label>
              <input
                type="email"
                className={styles.input}
                value={contact.emailGeneral}
                onChange={(e) => setContact({ ...contact, emailGeneral: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Job & Internship Email</label>
              <input
                type="email"
                className={styles.input}
                value={contact.emailJobs}
                onChange={(e) => setContact({ ...contact, emailJobs: e.target.value })}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Studio Phone Numbers</label>
            <input
              type="text"
              className={styles.input}
              value={contact.phone}
              placeholder="+91 9447751826 · +91 8129355855"
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Office Postal Address</label>
            <textarea
              className={styles.textarea}
              rows={3}
              value={contact.address}
              onChange={(e) => setContact({ ...contact, address: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Google Maps Pin URL</label>
            <input
              type="url"
              className={styles.input}
              value={contact.mapLink}
              onChange={(e) => setContact({ ...contact, mapLink: e.target.value })}
              required
            />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Social Networks</h2>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Instagram Profile URL</label>
              <input
                type="url"
                className={styles.input}
                value={contact.instagramUrl}
                onChange={(e) => setContact({ ...contact, instagramUrl: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Facebook Profile URL</label>
              <input
                type="url"
                className={styles.input}
                value={contact.facebookUrl}
                onChange={(e) => setContact({ ...contact, facebookUrl: e.target.value })}
                required
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
            {saving ? "Saving Changes..." : "Save Contact Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
