"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../admin.module.css";
import { JournalArticle } from "@/lib/types";

export default function AdminJournalPage() {
  const [articles, setArticles] = useState<JournalArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // Editor State
  const [modalItem, setModalItem] = useState<JournalArticle | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadArticles = async () => {
    try {
      const res = await fetch("/api/admin/journal");
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles);
      }
    } catch {
      showToast("Error loading journal articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase()) ||
      a.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleVisible = async (article: JournalArticle) => {
    try {
      const updated = !article.visible;
      const res = await fetch(`/api/admin/journal/${article.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: updated }),
      });
      if (res.ok) {
        setArticles(
          articles.map((a) => (a.slug === article.slug ? { ...a, visible: updated } : a))
        );
        showToast(`Article ${updated ? "published" : "hidden"}`);
      }
    } catch {
      showToast("Failed to update status");
    }
  };

  const handleToggleFeatured = async (article: JournalArticle) => {
    try {
      const updated = !article.featured;
      const res = await fetch(`/api/admin/journal/${article.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: updated }),
      });
      if (res.ok) {
        setArticles(
          articles.map((a) => (a.slug === article.slug ? { ...a, featured: updated } : a))
        );
        showToast(updated ? "Featured on Homepage Section 05" : "Removed from Homepage feature");
      }
    } catch {
      showToast("Failed to update status");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= articles.length) return;

    const newArticles = [...articles];
    const temp = newArticles[index];
    newArticles[index] = newArticles[targetIndex];
    newArticles[targetIndex] = temp;

    setArticles(newArticles);

    try {
      const orderedSlugs = newArticles.map((a) => a.slug);
      await fetch("/api/admin/journal/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedSlugs }),
      });
      showToast("Order saved");
    } catch {
      showToast("Order update failed");
      loadArticles();
    }
  };

  const handleDelete = async (slug: string) => {
    try {
      const res = await fetch(`/api/admin/journal/${slug}`, { method: "DELETE" });
      if (res.ok) {
        setArticles(articles.filter((a) => a.slug !== slug));
        showToast("Article deleted");
      } else {
        showToast("Failed to delete article");
      }
    } catch {
      showToast("Error deleting article");
    } finally {
      setDeleteConfirmSlug(null);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !modalItem) return;

    setUploadingCover(true);
    showToast("Uploading to Cloudinary...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "zerostudio/journal");

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
        const res = await fetch("/api/admin/journal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(modalItem),
        });
        const data = await res.json();
        if (res.ok) {
          showToast("Article published successfully");
          setModalItem(null);
          loadArticles();
        } else {
          showToast(data.error || "Failed to create article");
        }
      } else {
        const res = await fetch(`/api/admin/journal/${modalItem.slug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(modalItem),
        });
        if (res.ok) {
          showToast("Article updated");
          setModalItem(null);
          loadArticles();
        } else {
          showToast("Failed to update article");
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
          <h1 className={styles.pageTitle}>Journal Editorial</h1>
          <p className={styles.pageSubtitle}>
            Publish architectural essays, material studies, and process documentation
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => {
              setIsNew(true);
              setModalItem({
                title: "",
                slug: "",
                category: "Architecture & Context",
                date: new Date()
                  .toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                  .toUpperCase(),
                excerpt: "",
                image: "/projects/HAVEN/1-opt.jpg",
                author: "Zero Studio",
                content: {
                  intro: "",
                  paragraphs: ["First paragraph on spatial inquiry..."],
                },
                featured: false,
                visible: true,
                order: articles.length + 1,
              });
            }}
          >
            + Write Journal Article
          </button>
        </div>
      </div>

      <div className={styles.filterBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search articles by title, category or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Articles Directory ({filteredArticles.length})</h2>
          <span style={{ fontSize: "0.75rem", color: "#666" }}>
            Articles with &quot;Featured&quot; appear on Homepage Section 05
          </span>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "60px" }}>Order</th>
                <th style={{ width: "70px" }}>Cover</th>
                <th>Title & Slug</th>
                <th>Category</th>
                <th>Date</th>
                <th>Homepage</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((article, index) => (
                <tr key={article.slug}>
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
                          disabled={index === filteredArticles.length - 1}
                          onClick={() => handleMove(index, "down")}
                          title="Move down"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ width: "50px", height: "35px", position: "relative", borderRadius: "4px", overflow: "hidden", background: "#f0f0f0" }}>
                      <Image src={article.image} alt={article.title} fill sizes="50px" style={{ objectFit: "cover" }} />
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{article.title}</div>
                    <code style={{ fontSize: "0.72rem", color: "#666" }}>/journal/{article.slug}</code>
                  </td>
                  <td>{article.category}</td>
                  <td>{article.date}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(article)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      <span className={`${styles.badge} ${article.featured ? styles.badgeAccent : styles.badgeMuted}`}>
                        {article.featured ? "Featured" : "Standard"}
                      </span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggleVisible(article)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      <span className={`${styles.badge} ${article.visible ? styles.badgeSuccess : styles.badgeMuted}`}>
                        {article.visible ? "Live" : "Draft"}
                      </span>
                    </button>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "6px" }}>
                      <a
                        href={`/journal/${article.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}
                      >
                        Preview ↗
                      </a>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}
                        onClick={() => {
                          setIsNew(false);
                          setModalItem(JSON.parse(JSON.stringify(article)));
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                        onClick={() => setDeleteConfirmSlug(article.slug)}
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

      {/* Editor Modal */}
      {modalItem && (
        <div className={styles.modalOverlay} onClick={() => setModalItem(null)}>
          <div className={styles.modalContent} style={{ maxWidth: "780px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {isNew ? "Write Journal Article" : `Edit Article: ${modalItem.title}`}
              </h3>
              <button type="button" className={styles.closeBtn} onClick={() => setModalItem(null)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Article Title</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={modalItem.title}
                    onChange={(e) => {
                      const t = e.target.value;
                      const s = isNew
                        ? t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
                        : modalItem.slug;
                      setModalItem({ ...modalItem, title: t, slug: s });
                    }}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Slug</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={modalItem.slug}
                    onChange={(e) => setModalItem({ ...modalItem, slug: e.target.value })}
                    disabled={!isNew}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
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

                <div className={styles.formGroup}>
                  <label className={styles.label}>Publication Date</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={modalItem.date}
                    placeholder="05 OCTOBER 2026"
                    onChange={(e) => setModalItem({ ...modalItem, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup} style={{ border: "1px solid #ebebeb", padding: "14px", borderRadius: "6px", background: "#fafafa" }}>
                <label className={styles.label}>Cover Photography</label>
                <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                  <div style={{ width: "100px", height: "65px", position: "relative", borderRadius: "4px", overflow: "hidden", background: "#ddd" }}>
                    <Image src={modalItem.image} alt={modalItem.title} fill sizes="100px" style={{ objectFit: "cover" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={uploadingCover}
                      style={{ fontSize: "0.8rem", marginBottom: "6px" }}
                    />
                    <input
                      type="text"
                      className={styles.input}
                      value={modalItem.image}
                      onChange={(e) => setModalItem({ ...modalItem, image: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Article Excerpt / Card Description</label>
                <textarea
                  className={styles.textarea}
                  rows={2}
                  value={modalItem.excerpt}
                  onChange={(e) => setModalItem({ ...modalItem, excerpt: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Lead Introduction Paragraph</label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  value={modalItem.content.intro}
                  onChange={(e) =>
                    setModalItem({
                      ...modalItem,
                      content: { ...modalItem.content, intro: e.target.value },
                    })
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Main Essay Paragraphs</label>
                <textarea
                  className={styles.textarea}
                  rows={6}
                  value={modalItem.content.paragraphs.join("\n\n")}
                  placeholder="Separate paragraphs by pressing Enter twice..."
                  onChange={(e) =>
                    setModalItem({
                      ...modalItem,
                      content: {
                        ...modalItem.content,
                        paragraphs: e.target.value.split("\n\n").filter(Boolean),
                      },
                    })
                  }
                  required
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Secondary In-Article Image URL (Optional)</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={modalItem.content.secondaryImage || ""}
                    onChange={(e) =>
                      setModalItem({
                        ...modalItem,
                        content: { ...modalItem.content, secondaryImage: e.target.value },
                      })
                    }
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Secondary Image Caption</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={modalItem.content.secondaryImageCaption || ""}
                    onChange={(e) =>
                      setModalItem({
                        ...modalItem,
                        content: {
                          ...modalItem.content,
                          secondaryImageCaption: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "20px", margin: "16px 0" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={modalItem.featured}
                    onChange={(e) => setModalItem({ ...modalItem, featured: e.target.checked })}
                  />
                  <span>Feature on Homepage (Page 05)</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={modalItem.visible}
                    onChange={(e) => setModalItem({ ...modalItem, visible: e.target.checked })}
                  />
                  <span>Published / Live</span>
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
                <button
                  type="submit"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  disabled={uploadingCover}
                >
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmSlug && (
        <div className={styles.modalOverlay} onClick={() => setDeleteConfirmSlug(null)}>
          <div className={styles.modalContent} style={{ maxWidth: "400px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle} style={{ color: "#dc2626" }}>
                Delete Article?
              </h3>
              <button type="button" className={styles.closeBtn} onClick={() => setDeleteConfirmSlug(null)}>
                ✕
              </button>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#444" }}>
              Are you sure you want to permanently delete article &quot;{deleteConfirmSlug}&quot;?
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "flex-end" }}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => setDeleteConfirmSlug(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnDanger}`}
                onClick={() => handleDelete(deleteConfirmSlug)}
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
