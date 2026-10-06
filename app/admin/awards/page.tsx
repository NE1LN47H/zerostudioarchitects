"use client";

import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import { AwardItem } from "@/lib/types";

export default function AdminAwardsPage() {
  const [awards, setAwards] = useState<AwardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "curated" | "project" | "honor">("all");
  const [toast, setToast] = useState<string | null>(null);

  // Modal State
  const [modalItem, setModalItem] = useState<AwardItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadAwards = async () => {
    try {
      const res = await fetch("/api/admin/awards");
      if (res.ok) {
        const data = await res.json();
        setAwards(data.awards);
      }
    } catch {
      showToast("Error loading awards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAwards();
  }, []);

  const filteredAwards = awards.filter((a) => {
    if (filterType === "curated") return a.curated;
    if (filterType === "project") return a.type === "project";
    if (filterType === "honor") return a.type === "honor";
    return true;
  });

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= awards.length) return;

    const newAwards = [...awards];
    const temp = newAwards[index];
    newAwards[index] = newAwards[targetIndex];
    newAwards[targetIndex] = temp;

    setAwards(newAwards);

    try {
      const orderedIds = newAwards.map((a) => a.id);
      await fetch("/api/admin/awards/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      showToast("Awards order updated");
    } catch {
      showToast("Order update failed");
      loadAwards();
    }
  };

  const handleToggleCurated = async (award: AwardItem) => {
    try {
      const updated = !award.curated;
      const res = await fetch(`/api/admin/awards/${award.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ curated: updated }),
      });
      if (res.ok) {
        setAwards(
          awards.map((a) => (a.id === award.id ? { ...a, curated: updated } : a))
        );
        showToast(
          updated ? "Added to Homepage 3x2 Grid" : "Removed from Homepage preview"
        );
      }
    } catch {
      showToast("Failed to update status");
    }
  };

  const handleToggleVisible = async (award: AwardItem) => {
    try {
      const updated = !award.visible;
      const res = await fetch(`/api/admin/awards/${award.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: updated }),
      });
      if (res.ok) {
        setAwards(
          awards.map((a) => (a.id === award.id ? { ...a, visible: updated } : a))
        );
        showToast(`Award ${updated ? "visible" : "hidden"}`);
      }
    } catch {
      showToast("Failed to update visibility");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/awards/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAwards(awards.filter((a) => a.id !== id));
        showToast("Award record deleted");
      } else {
        showToast("Failed to delete award");
      }
    } catch {
      showToast("Error deleting award");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalItem) return;

    try {
      if (isNew) {
        const res = await fetch("/api/admin/awards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(modalItem),
        });
        if (res.ok) {
          showToast("Award created successfully");
          setModalItem(null);
          loadAwards();
        } else {
          showToast("Failed to create award");
        }
      } else {
        const res = await fetch(`/api/admin/awards/${modalItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(modalItem),
        });
        if (res.ok) {
          showToast("Award updated");
          setModalItem(null);
          loadAwards();
        } else {
          showToast("Failed to update award");
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
          <h1 className={styles.pageTitle}>Awards & Recognitions</h1>
          <p className={styles.pageSubtitle}>
            Manage editorial awards for Page 04 homepage preview and full archival list
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
                number: "0" + (awards.length + 1),
                award: "",
                project: "HAVEN, Kannur",
                organization: "Architectural Award Organization",
                category: "Residential Architecture",
                year: new Date().getFullYear().toString(),
                order: awards.length + 1,
                curated: false,
                visible: true,
                type: "project",
              });
            }}
          >
            + Add Award
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterBar}>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            className={`${styles.btn} ${filterType === "all" ? styles.btnPrimary : styles.btnSecondary} ${styles.btnSm}`}
            onClick={() => setFilterType("all")}
          >
            All Citations ({awards.length})
          </button>
          <button
            type="button"
            className={`${styles.btn} ${filterType === "curated" ? styles.btnPrimary : styles.btnSecondary} ${styles.btnSm}`}
            onClick={() => setFilterType("curated")}
          >
            Homepage 3x2 Curated ({awards.filter((a) => a.curated).length})
          </button>
          <button
            type="button"
            className={`${styles.btn} ${filterType === "project" ? styles.btnPrimary : styles.btnSecondary} ${styles.btnSm}`}
            onClick={() => setFilterType("project")}
          >
            Project Recognitions ({awards.filter((a) => a.type === "project").length})
          </button>
          <button
            type="button"
            className={`${styles.btn} ${filterType === "honor" ? styles.btnPrimary : styles.btnSecondary} ${styles.btnSm}`}
            onClick={() => setFilterType("honor")}
          >
            Studio Honors ({awards.filter((a) => a.type === "honor").length})
          </button>
        </div>
      </div>

      {/* Awards Table */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Awards Archive ({filteredAwards.length})</h2>
          <span style={{ fontSize: "0.75rem", color: "#666" }}>
            Items with &quot;Curated&quot; badge appear in the 3×2 grid on Homepage Section 04
          </span>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "60px" }}>Order</th>
                <th>Award Citation</th>
                <th>Project / Recipient</th>
                <th>Organization</th>
                <th>Category</th>
                <th>Year</th>
                <th>Homepage</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAwards.map((item, index) => (
                <tr key={item.id}>
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
                          disabled={index === filteredAwards.length - 1}
                          onClick={() => handleMove(index, "down")}
                          title="Move down"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: "#111" }}>{item.award}</td>
                  <td>{item.project}</td>
                  <td>{item.organization}</td>
                  <td>{item.category}</td>
                  <td>{item.year}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggleCurated(item)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      title="Toggle visibility in 3x2 homepage preview"
                    >
                      <span className={`${styles.badge} ${item.curated ? styles.badgeAccent : styles.badgeMuted}`}>
                        {item.curated ? "Curated" : "Archive"}
                      </span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggleVisible(item)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      <span className={`${styles.badge} ${item.visible ? styles.badgeSuccess : styles.badgeMuted}`}>
                        {item.visible ? "Live" : "Hidden"}
                      </span>
                    </button>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "6px" }}>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}
                        onClick={() => {
                          setIsNew(false);
                          setModalItem(item);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                        onClick={() => setDeleteConfirmId(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {modalItem && (
        <div className={styles.modalOverlay} onClick={() => setModalItem(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {isNew ? "Add Award Citation" : "Edit Award Details"}
              </h3>
              <button type="button" className={styles.closeBtn} onClick={() => setModalItem(null)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Award Title / Honor</label>
                <input
                  type="text"
                  className={styles.input}
                  value={modalItem.award}
                  placeholder="e.g. Silver Leaf Award, Winner Landscape Design"
                  onChange={(e) => setModalItem({ ...modalItem, award: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Associated Project / Recipient</label>
                <input
                  type="text"
                  className={styles.input}
                  value={modalItem.project}
                  placeholder="e.g. HAVEN, Kannur or Ar. Hamid MM & Zero Studio Team"
                  onChange={(e) => setModalItem({ ...modalItem, project: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Awarding Body / Organization</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={modalItem.organization}
                    placeholder="e.g. IIA National Awards, Kohler Bold Design"
                    onChange={(e) => setModalItem({ ...modalItem, organization: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Category</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={modalItem.category}
                    placeholder="e.g. Residential Interior"
                    onChange={(e) => setModalItem({ ...modalItem, category: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Year</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={modalItem.year}
                    placeholder="2026"
                    onChange={(e) => setModalItem({ ...modalItem, year: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Type</label>
                  <select
                    className={styles.select}
                    value={modalItem.type}
                    onChange={(e) => setModalItem({ ...modalItem, type: e.target.value as any })}
                  >
                    <option value="curated">Curated Preview</option>
                    <option value="project">Project Recognition</option>
                    <option value="honor">Studio Honor</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: "20px", margin: "16px 0" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={modalItem.curated}
                    onChange={(e) => setModalItem({ ...modalItem, curated: e.target.checked })}
                  />
                  <span>Show in Homepage 3x2 Grid (Curated)</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={modalItem.visible}
                    onChange={(e) => setModalItem({ ...modalItem, visible: e.target.checked })}
                  />
                  <span>Visible / Published</span>
                </label>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "24px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => setModalItem(null)}
                >
                  Cancel
                </button>
                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                  Save Award
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className={styles.modalOverlay} onClick={() => setDeleteConfirmId(null)}>
          <div className={styles.modalContent} style={{ maxWidth: "400px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle} style={{ color: "#dc2626" }}>
                Delete Award?
              </h3>
              <button type="button" className={styles.closeBtn} onClick={() => setDeleteConfirmId(null)}>
                ✕
              </button>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#444" }}>
              Are you sure you want to delete this award citation? It will be removed from both the public awards page and archive modal.
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "flex-end" }}>
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
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
