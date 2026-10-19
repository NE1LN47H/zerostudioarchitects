"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import styles from "../admin.module.css";
import { MediaPublication } from "@/types";

const PLATFORMS = [
  "All",
  "Archdaily",
  "Designboom",
  "Buildofy",
  "Architect and Interiors India",
  "YouTube",
  "Others",
];

export default function AdminMediaPublicationsPage() {
  const [publications, setPublications] = useState<MediaPublication[]>([]);
  const [, setLoading] = useState(true);
  const [filterPlatform, setFilterPlatform] = useState("All");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // Editor Modal State
  const [modalItem, setModalItem] = useState<MediaPublication | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadPublications = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/publications");
      if (res.ok) {
        const data = await res.json();
        setPublications(data.publications || []);
      }
    } catch {
      showToast("Error loading publications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPublications();
  }, [loadPublications]);

  const filteredPublications = publications.filter((p) => {
    if (filterPlatform !== "All" && p.platform !== filterPlatform) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchProject = p.project?.toLowerCase().includes(q);
      const matchPlatform = p.platform.toLowerCase().includes(q);
      if (!matchTitle && !matchProject && !matchPlatform) return false;
    }
    return true;
  });

  const handleToggleVisible = async (item: MediaPublication) => {
    const updated = !item.visible;
    setPublications(publications.map((p) => (p.id === item.id ? { ...p, visible: updated } : p)));

    try {
      const res = await fetch(`/api/admin/publications/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: updated }),
      });
      if (res.ok) {
        showToast(updated ? "Publication published" : "Publication hidden");
      }
    } catch {
      showToast("Failed to update status");
    }
  };

  const handleToggleCurated = async (item: MediaPublication) => {
    const updated = !item.curated;
    setPublications(publications.map((p) => (p.id === item.id ? { ...p, curated: updated } : p)));

    try {
      const res = await fetch(`/api/admin/publications/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ curated: updated }),
      });
      if (res.ok) {
        showToast(updated ? "Featured on Homepage Section 05" : "Removed from Homepage feature");
      }
    } catch {
      showToast("Failed to update status");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= publications.length) return;

    const newPubs = [...publications];
    const temp = newPubs[index];
    newPubs[index] = newPubs[targetIndex];
    newPubs[targetIndex] = temp;

    setPublications(newPubs);

    try {
      const orderedIds = newPubs.map((p) => p.id);
      await fetch("/api/admin/publications/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      showToast("Order updated");
    } catch {
      showToast("Order update failed");
      loadPublications();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/publications/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPublications(publications.filter((p) => p.id !== id));
        showToast("Publication removed");
      } else {
        showToast("Failed to remove publication");
      }
    } catch {
      showToast("Delete failed");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !modalItem) return;

    setUploadingCover(true);
    showToast("Uploading media image...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "zerostudio/media");

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setModalItem({
          ...modalItem,
          image: data.asset.url,
          imagePublicId: data.asset.publicId,
        });
        showToast("Cover image uploaded");
      }
    } catch {
      showToast("Upload failed");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalItem) return;

    try {
      if (isNew) {
        const res = await fetch("/api/admin/publications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(modalItem),
        });
        if (res.ok) {
          const data = await res.json();
          setPublications([data.publication, ...publications]);
          showToast("Media publication added");
          setModalItem(null);
        } else {
          showToast("Failed to add publication");
        }
      } else {
        const res = await fetch(`/api/admin/publications/${modalItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(modalItem),
        });
        if (res.ok) {
          const data = await res.json();
          setPublications(publications.map((p) => (p.id === data.publication.id ? data.publication : p)));
          showToast("Media publication updated");
          setModalItem(null);
        } else {
          showToast("Failed to update publication");
        }
      }
    } catch {
      showToast("Operation failed");
    }
  };

  return (
    <div>
      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>In the Media Editorial</h1>
          <p className={styles.pageSubtitle}>
            Manage works published at national &amp; international platforms (Archdaily, Designboom, Buildofy, YouTube, etc.)
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => {
              setIsNew(true);
              setModalItem({
                id: "",
                title: "",
                platform: "Archdaily",
                project: "",
                url: "",
                year: new Date().getFullYear().toString(),
                format: "Online Feature",
                description: "",
                image: "/projects/HAVEN/1-opt.jpg",
                curated: false,
                visible: true,
                order: publications.length + 1,
              });
            }}
          >
            + Add Publication / Link
          </button>
        </div>
      </div>

      <div className={styles.filterBar}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          {PLATFORMS.map((plat) => (
            <button
              key={plat}
              type="button"
              className={filterPlatform === plat ? styles.btnPrimary : styles.btnSecondary}
              style={{
                padding: "6px 14px",
                fontSize: "0.75rem",
                borderRadius: "20px",
                cursor: "pointer",
              }}
              onClick={() => setFilterPlatform(plat)}
            >
              {plat}
            </button>
          ))}
        </div>

        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by title, project or platform..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "300px" }}
        />
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Published Features Directory ({filteredPublications.length})</h2>
          <span style={{ fontSize: "0.75rem", color: "#666" }}>
            Items with &quot;Curated on Homepage&quot; appear on Section 05
          </span>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "50px" }}>Order</th>
                <th style={{ width: "60px" }}>Cover</th>
                <th>Title & Headline</th>
                <th>Platform</th>
                <th>Project</th>
                <th>Year</th>
                <th>Format</th>
                <th>Link</th>
                <th>Homepage</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPublications.map((pub, index) => (
                <tr key={pub.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontWeight: 600, minWidth: "18px" }}>{index + 1}</span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <button
                          type="button"
                          className={styles.btnSm}
                          style={{ border: "1px solid #ddd", background: "#fff", cursor: "pointer", padding: "1px 4px", fontSize: "0.65rem" }}
                          disabled={index === 0}
                          onClick={() => handleMove(index, "up")}
                          title="Move up"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          className={styles.btnSm}
                          style={{ border: "1px solid #ddd", background: "#fff", cursor: "pointer", padding: "1px 4px", fontSize: "0.65rem" }}
                          disabled={index === publications.length - 1}
                          onClick={() => handleMove(index, "down")}
                          title="Move down"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
                    {pub.image ? (
                      <div style={{ width: "52px", height: "36px", position: "relative", borderRadius: "3px", overflow: "hidden", background: "#eee" }}>
                        <Image src={pub.image} alt={pub.title} fill sizes="52px" style={{ objectFit: "cover" }} />
                      </div>
                    ) : (
                      <div style={{ width: "52px", height: "36px", background: "#f0f0f0", borderRadius: "3px" }} />
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "#111", fontSize: "0.875rem" }}>{pub.title}</div>
                    {pub.description && (
                      <div style={{ fontSize: "0.75rem", color: "#666", marginTop: "2px" }}>{pub.description}</div>
                    )}
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "3px 8px",
                        background: "#f0f0f0",
                        borderRadius: "12px",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {pub.platform}
                    </span>
                  </td>
                  <td>{pub.project || "—"}</td>
                  <td>{pub.year}</td>
                  <td>
                    <span style={{ fontSize: "0.75rem", color: "#555" }}>{pub.format || "Online"}</span>
                  </td>
                  <td>
                    {pub.url ? (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#0066cc", fontSize: "0.8rem", textDecoration: "none" }}
                        title={pub.url}
                      >
                        Visit ↗
                      </a>
                    ) : (
                      <span style={{ fontSize: "0.75rem", color: "#999" }}>Print / Offline</span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`${styles.badge} ${pub.curated ? styles.badgeSuccess : styles.badgeInactive}`}
                      onClick={() => handleToggleCurated(pub)}
                      style={{ cursor: "pointer", border: "none" }}
                    >
                      {pub.curated ? "★ Homepage" : "Standard"}
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`${styles.badge} ${pub.visible ? styles.badgeSuccess : styles.badgeInactive}`}
                      onClick={() => handleToggleVisible(pub)}
                      style={{ cursor: "pointer", border: "none" }}
                    >
                      {pub.visible ? "Published" : "Hidden"}
                    </button>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}
                        onClick={() => {
                          setIsNew(false);
                          setModalItem({ ...pub });
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                        onClick={() => setDeleteConfirmId(pub.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPublications.length === 0 && (
                <tr>
                  <td colSpan={11} style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                    No media publications found in this view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {modalItem && (
        <div className={styles.modalOverlay} onClick={() => setModalItem(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "640px" }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {isNew ? "Add Media Feature / Publication" : "Edit Media Publication"}
              </h3>
              <button type="button" className={styles.modalClose} onClick={() => setModalItem(null)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Title / Headline *</label>
                <input
                  type="text"
                  className={styles.input}
                  value={modalItem.title}
                  onChange={(e) => setModalItem({ ...modalItem, title: e.target.value })}
                  placeholder="e.g. Haven House: Tropical Gardens and Brickwork"
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Platform *</label>
                  <select
                    className={styles.input}
                    value={modalItem.platform}
                    onChange={(e) => setModalItem({ ...modalItem, platform: e.target.value })}
                  >
                    <option value="Archdaily">Archdaily</option>
                    <option value="Designboom">Designboom</option>
                    <option value="Buildofy">Buildofy</option>
                    <option value="Architect and Interiors India">Architect and Interiors India</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Associated Project</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={modalItem.project || ""}
                    onChange={(e) => setModalItem({ ...modalItem, project: e.target.value })}
                    placeholder="e.g. HAVEN, Halaman, Mausam..."
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Publication URL</label>
                <input
                  type="url"
                  className={styles.input}
                  value={modalItem.url || ""}
                  onChange={(e) => setModalItem({ ...modalItem, url: e.target.value })}
                  placeholder="https://www.archdaily.com/..."
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Year</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={modalItem.year}
                    onChange={(e) => setModalItem({ ...modalItem, year: e.target.value })}
                    placeholder="e.g. 2025"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Format / Type</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={modalItem.format || ""}
                    onChange={(e) => setModalItem({ ...modalItem, format: e.target.value })}
                    placeholder="e.g. Online Feature, Video, Print"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description / Magazine Note</label>
                <input
                  type="text"
                  className={styles.input}
                  value={modalItem.description || ""}
                  onChange={(e) => setModalItem({ ...modalItem, description: e.target.value })}
                  placeholder="e.g. Indian Architect and Builder Magazine (2017) or Korean Print edition"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Cover Image</label>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <input
                    type="text"
                    className={styles.input}
                    value={modalItem.image || ""}
                    onChange={(e) => setModalItem({ ...modalItem, image: e.target.value })}
                    placeholder="/projects/HAVEN/1-opt.jpg"
                    style={{ flex: 1 }}
                  />
                  <label
                    className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}
                    style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    {uploadingCover ? "Uploading..." : "Upload New"}
                    <input type="file" accept="image/*" onChange={handleUploadImage} style={{ display: "none" }} />
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", gap: "24px", marginTop: "16px", padding: "12px", background: "#f9f9f9", borderRadius: "6px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={modalItem.curated}
                    onChange={(e) => setModalItem({ ...modalItem, curated: e.target.checked })}
                  />
                  <span>Curated on Homepage (Section 05)</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={modalItem.visible}
                    onChange={(e) => setModalItem({ ...modalItem, visible: e.target.checked })}
                  />
                  <span>Visible on Public Website</span>
                </label>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setModalItem(null)}>
                  Cancel
                </button>
                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                  {isNew ? "Create Feature" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className={styles.modalOverlay} onClick={() => setDeleteConfirmId(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "420px" }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Confirm Removal</h3>
              <button type="button" className={styles.modalClose} onClick={() => setDeleteConfirmId(null)}>
                ✕
              </button>
            </div>
            <p style={{ fontSize: "0.9rem", color: "#555", margin: "16px 0 24px" }}>
              Are you sure you want to remove this publication link? This action cannot be undone.
            </p>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnDanger}`}
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
