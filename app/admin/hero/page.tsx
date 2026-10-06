"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../admin.module.css";
import { HeroItem } from "@/lib/types";

export default function AdminHeroPage() {
  const [items, setItems] = useState<HeroItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [modalItem, setModalItem] = useState<HeroItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile_2x2" | "mobile_2x3">("desktop");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadHeroItems = async () => {
    try {
      const res = await fetch("/api/admin/hero");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
      }
    } catch {
      showToast("Error loading hero items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHeroItems();
  }, []);

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    setItems(newItems);

    try {
      const orderedIds = newItems.map((i) => i.id);
      await fetch("/api/admin/hero/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      showToast("Order updated");
    } catch {
      showToast("Failed to save new order");
      loadHeroItems();
    }
  };

  const handleToggleVisible = async (item: HeroItem) => {
    try {
      const updated = !item.visible;
      const res = await fetch(`/api/admin/hero/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: updated }),
      });
      if (res.ok) {
        setItems(items.map((i) => (i.id === item.id ? { ...i, visible: updated } : i)));
        showToast(`Item ${updated ? "visible" : "hidden"}`);
      }
    } catch {
      showToast("Failed to update visibility");
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalItem) return;

    try {
      if (isNew) {
        const res = await fetch("/api/admin/hero", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(modalItem),
        });
        if (res.ok) {
          showToast("Hero item added successfully");
          setModalItem(null);
          loadHeroItems();
        } else {
          showToast("Failed to add hero item");
        }
      } else {
        const res = await fetch(`/api/admin/hero/${modalItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(modalItem),
        });
        if (res.ok) {
          showToast("Hero item updated");
          setModalItem(null);
          loadHeroItems();
        } else {
          showToast("Failed to update item");
        }
      }
    } catch {
      showToast("Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/hero/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems(items.filter((i) => i.id !== id));
        showToast("Hero item removed");
      } else {
        showToast("Failed to delete item");
      }
    } catch {
      showToast("Error deleting item");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !modalItem) return;

    setUploading(true);
    showToast("Uploading to Cloudinary...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "zerostudio/hero");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setModalItem({
          ...modalItem,
          image: data.asset.url,
          imagePublicId: data.asset.publicId,
        });
        showToast("Image uploaded successfully");
      } else {
        showToast("Upload failed");
      }
    } catch {
      showToast("Upload error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Hero Photo Wall</h1>
          <p className={styles.pageSubtitle}>
            Manage the 6×3 architectural grid displayed on Page 01 of the public website
          </p>
        </div>

        <div className={styles.headerActions}>
          <div style={{ display: "flex", border: "1px solid #ddd", borderRadius: "6px", overflow: "hidden" }}>
            <button
              type="button"
              className={styles.btn}
              style={{
                borderRadius: 0,
                background: previewMode === "desktop" ? "#111" : "#fff",
                color: previewMode === "desktop" ? "#fff" : "#444",
                padding: "6px 12px",
                fontSize: "0.78rem",
              }}
              onClick={() => setPreviewMode("desktop")}
            >
              Desktop 6×3 (18)
            </button>
            <button
              type="button"
              className={styles.btn}
              style={{
                borderRadius: 0,
                background: previewMode === "mobile_2x2" ? "#111" : "#fff",
                color: previewMode === "mobile_2x2" ? "#fff" : "#444",
                padding: "6px 12px",
                fontSize: "0.78rem",
              }}
              onClick={() => setPreviewMode("mobile_2x2")}
            >
              Mobile 2×2 (4)
            </button>
            <button
              type="button"
              className={styles.btn}
              style={{
                borderRadius: 0,
                background: previewMode === "mobile_2x3" ? "#111" : "#fff",
                color: previewMode === "mobile_2x3" ? "#fff" : "#444",
                padding: "6px 12px",
                fontSize: "0.78rem",
              }}
              onClick={() => setPreviewMode("mobile_2x3")}
            >
              Mobile 2×3 (6)
            </button>
          </div>

          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => {
              setIsNew(true);
              setModalItem({
                id: "",
                image: "/projects/HAVEN/1-opt.jpg",
                title: "NEW PROJECT",
                category: "RESIDENTIAL",
                year: new Date().getFullYear().toString(),
                meta: `RESIDENTIAL · ${new Date().getFullYear()}`,
                order: items.length + 1,
                visible: true,
              });
            }}
          >
            + Add Hero Image
          </button>
        </div>
      </div>

      {/* Visual Live Hero Grid Preview */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>
              Live Hero Preview:{" "}
              {previewMode === "desktop"
                ? "Desktop 6×3 Grid (All 18 Photos)"
                : previewMode === "mobile_2x2"
                ? "Standard Mobile 2×2 Grid (Top 4 Photos, 100svh fit)"
                : "Tall Mobile 2×3 Grid (Top 6 Photos)"}
            </h2>
            <div style={{ fontSize: "0.75rem", color: "#666", marginTop: "4px" }}>
              {previewMode === "desktop"
                ? "Full architectural continuous wall on desktop viewports."
                : previewMode === "mobile_2x2"
                ? "On smartphones, the site renders the first 4 items in a 2×2 grid to fit within 100svh."
                : "On taller smartphone screens (min-height: 750px), the site renders the first 6 items in a 2×3 grid."}
            </div>
          </div>
          <span style={{ fontSize: "0.75rem", color: "#888" }}>
            Hover images to preview color transition
          </span>
        </div>

        {previewMode === "desktop" ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              aspectRatio: "6/3",
              gap: "5px",
              background: "#ebebeb",
              padding: "4px",
              borderRadius: "4px",
              overflow: "hidden",
              maxHeight: "420px",
            }}
          >
            {items
              .filter((i) => i.visible)
              .map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    position: "relative",
                    background: "#222",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setIsNew(false);
                    setModalItem(item);
                  }}
                  title={`#${idx + 1}: ${item.title} (${item.category}) — Click to edit`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="200px"
                    style={{
                      objectFit: "cover",
                      filter: "grayscale(100%)",
                      transition: "filter 0.3s ease, transform 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = "grayscale(0%)";
                      e.currentTarget.style.transform = "scale(1.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = "grayscale(100%)";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "4px 6px",
                      background: "rgba(0,0,0,0.6)",
                      color: "#fff",
                      fontSize: "0.62rem",
                      pointerEvents: "none",
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{item.title}</div>
                    <div style={{ opacity: 0.8 }}>{item.category}</div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          /* Realistic Phone Viewport Simulator */
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "20px 0",
              background: "#f7f7f7",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                width: "320px",
                height: "520px",
                background: "#ffffff",
                border: "8px solid #1a1a1a",
                borderRadius: "32px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                padding: "20px 14px 16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflow: "hidden",
              }}
            >
              {/* Studio Header on Mobile */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.18em", color: "#111" }}>
                  THE STUDIO
                </span>
                <span style={{ width: "30px", height: "1px", background: "#111" }} />
              </div>

              {/* Exact Mobile Grid (2x2 or 2x3) */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gridTemplateRows: previewMode === "mobile_2x2" ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
                  gap: "4px",
                  flex: 1,
                  minHeight: 0,
                }}
              >
                {items
                  .filter((i) => i.visible)
                  .slice(0, previewMode === "mobile_2x2" ? 4 : 6)
                  .map((item, idx) => (
                    <div
                      key={item.id}
                      style={{
                        position: "relative",
                        background: "#222",
                        overflow: "hidden",
                        borderRadius: "2px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setIsNew(false);
                        setModalItem(item);
                      }}
                      title={`#${idx + 1}: ${item.title} — Click to edit`}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="160px"
                        style={{
                          objectFit: "cover",
                          filter: "grayscale(100%)",
                          transition: "filter 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.filter = "grayscale(0%)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.filter = "grayscale(100%)";
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: "4px",
                          background: "rgba(0,0,0,0.65)",
                          color: "#fff",
                          fontSize: "0.55rem",
                          pointerEvents: "none",
                        }}
                      >
                        <div style={{ fontWeight: 600 }}>{item.title}</div>
                        <div style={{ opacity: 0.8 }}>{item.category}</div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Mobile Phone Home Indicator */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: "12px" }}>
                <div style={{ width: "80px", height: "3px", background: "#aaa", borderRadius: "2px" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hero Table / Management Cards */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Hero Items ({items.length})</h2>
          <span style={{ fontSize: "0.75rem", color: "#666" }}>
            Reorder using Up/Down buttons or edit image properties
          </span>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "60px" }}>Order</th>
                <th style={{ width: "80px" }}>Photo</th>
                <th>Project Title</th>
                <th>Category</th>
                <th>Year</th>
                <th>Linked Slug</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
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
                          disabled={index === items.length - 1}
                          onClick={() => handleMove(index, "down")}
                          title="Move down"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ width: "50px", height: "35px", position: "relative", borderRadius: "4px", overflow: "hidden", background: "#eee" }}>
                      <Image src={item.image} alt={item.title} fill sizes="50px" style={{ objectFit: "cover" }} />
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{item.title}</td>
                  <td>{item.category}</td>
                  <td>{item.year}</td>
                  <td>
                    {item.projectSlug ? (
                      <code style={{ fontSize: "0.72rem", background: "#f3f3f3", padding: "2px 5px", borderRadius: "3px" }}>
                        {item.projectSlug}
                      </code>
                    ) : (
                      <span style={{ color: "#aaa" }}>—</span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggleVisible(item)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      <span className={`${styles.badge} ${item.visible ? styles.badgeSuccess : styles.badgeMuted}`}>
                        {item.visible ? "Visible" : "Hidden"}
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
                {isNew ? "Add Hero Wall Image" : `Edit Hero Item #${modalItem.id}`}
              </h3>
              <button type="button" className={styles.closeBtn} onClick={() => setModalItem(null)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div style={{ marginBottom: "18px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ width: "120px", height: "80px", position: "relative", borderRadius: "6px", overflow: "hidden", background: "#f0f0f0", flexShrink: 0 }}>
                  <Image src={modalItem.image} alt={modalItem.title} fill sizes="120px" style={{ objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className={styles.label}>Upload / Replace Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    style={{ fontSize: "0.8rem" }}
                  />
                  <div style={{ fontSize: "0.72rem", color: "#666", marginTop: "4px" }}>
                    {uploading ? "Uploading to Cloudinary..." : "Or specify Cloudinary / local image URL below"}
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Image URL</label>
                <input
                  type="text"
                  className={styles.input}
                  value={modalItem.image}
                  onChange={(e) => setModalItem({ ...modalItem, image: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Project Title</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={modalItem.title}
                    onChange={(e) => setModalItem({ ...modalItem, title: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Category</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={modalItem.category}
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
                    onChange={(e) => setModalItem({ ...modalItem, year: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Linked Project Slug (Optional)</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={modalItem.projectSlug || ""}
                    placeholder="e.g. HAVEN"
                    onChange={(e) => setModalItem({ ...modalItem, projectSlug: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "24px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => setModalItem(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  disabled={uploading}
                >
                  Save Hero Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className={styles.modalOverlay} onClick={() => setDeleteConfirmId(null)}>
          <div className={styles.modalContent} style={{ maxWidth: "420px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle} style={{ color: "#dc2626" }}>
                Confirm Deletion
              </h3>
              <button type="button" className={styles.closeBtn} onClick={() => setDeleteConfirmId(null)}>
                ✕
              </button>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#444", lineHeight: 1.5 }}>
              Are you sure you want to remove this hero grid item? This action will update the public hero wall immediately.
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
                Yes, Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
