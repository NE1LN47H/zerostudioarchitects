"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../admin.module.css";
import { Project, ProjectGalleryItem, ProjectNarrativeSection } from "@/lib/types";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [toast, setToast] = useState<string | null>(null);

  // Editor Modal / Drawer State
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const loadProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
      }
    } catch {
      showToast("Error loading projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || p.category.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(projects.map((p) => p.category)));

  const handleToggleVisible = async (project: Project) => {
    try {
      const updated = !project.visible;
      const res = await fetch(`/api/admin/projects/${project.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: updated }),
      });
      if (res.ok) {
        setProjects(
          projects.map((p) => (p.slug === project.slug ? { ...p, visible: updated } : p))
        );
        showToast(`Project ${updated ? "published" : "hidden"}`);
      }
    } catch {
      showToast("Failed to update status");
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      const updated = !project.featured;
      const res = await fetch(`/api/admin/projects/${project.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: updated }),
      });
      if (res.ok) {
        setProjects(
          projects.map((p) => (p.slug === project.slug ? { ...p, featured: updated } : p))
        );
        showToast(`Project marked as ${updated ? "Featured on Home" : "Standard"}`);
      }
    } catch {
      showToast("Failed to update featured state");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const newProjects = [...projects];
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    setProjects(newProjects);

    try {
      const orderedSlugs = newProjects.map((p) => p.slug);
      await fetch("/api/admin/projects/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedSlugs }),
      });
      showToast("Project order updated");
    } catch {
      showToast("Order update failed");
      loadProjects();
    }
  };

  const handleDelete = async (slug: string) => {
    try {
      const res = await fetch(`/api/admin/projects/${slug}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter((p) => p.slug !== slug));
        showToast("Project deleted successfully");
      } else {
        showToast("Failed to delete project");
      }
    } catch {
      showToast("Error deleting project");
    } finally {
      setDeleteConfirmSlug(null);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;

    setUploadingCover(true);
    showToast("Uploading cover to Cloudinary...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", `zerostudio/projects/${editingProject.slug || "new"}`);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setEditingProject({
          ...editingProject,
          heroImage: data.asset.url,
          heroImagePublicId: data.asset.publicId,
        });
        showToast("Cover image uploaded");
      }
    } catch {
      showToast("Cover upload failed");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingProject) return;

    setUploadingGallery(true);
    showToast("Uploading gallery image...");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", `zerostudio/projects/${editingProject.slug || "new"}`);

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          const newImg: ProjectGalleryItem = {
            src: data.asset.url,
            publicId: data.asset.publicId,
            alt: `${editingProject.title} architectural view`,
            caption: "",
            aspectRatio: "landscape",
          };
          setEditingProject((prev) =>
            prev ? { ...prev, gallery: [...prev.gallery, newImg] } : prev
          );
        }
      } catch (err) {
        console.error(err);
      }
    }

    setUploadingGallery(false);
    showToast("Gallery updated");
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      if (isNew) {
        const res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProject),
        });
        const data = await res.json();
        if (res.ok) {
          showToast("Project created successfully");
          setEditorOpen(false);
          loadProjects();
        } else {
          showToast(data.error || "Failed to create project");
        }
      } else {
        const res = await fetch(`/api/admin/projects/${editingProject.slug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProject),
        });
        if (res.ok) {
          showToast("Project updated successfully");
          setEditorOpen(false);
          loadProjects();
        } else {
          showToast("Failed to update project");
        }
      }
    } catch {
      showToast("Error saving project");
    }
  };

  const openCreateModal = () => {
    setIsNew(true);
    setEditingProject({
      slug: "",
      title: "",
      subtitle: "",
      category: "Residential Architecture",
      year: new Date().getFullYear().toString(),
      location: "Kerala, India",
      area: "3,000 sqft",
      leadArchitects: "Hafeez & Arjun",
      photography: "Abhimanyu KV",
      awards: [],
      heroImage: "/projects/HAVEN/1-opt.jpg",
      summary: "",
      narrative: [
        {
          heading: "Design Philosophy",
          paragraphs: ["Site context and responsive architecture dialogue."],
        },
      ],
      gallery: [],
      featured: false,
      visible: true,
      order: projects.length + 1,
    });
    setEditorOpen(true);
  };

  const openEditModal = (p: Project) => {
    setIsNew(false);
    setEditingProject(JSON.parse(JSON.stringify(p)));
    setEditorOpen(true);
  };

  return (
    <div>
      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Architectural Projects</h1>
          <p className={styles.pageSubtitle}>
            Manage project portfolios, specifications, narratives and gallery media
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={openCreateModal}
          >
            + Create New Project
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={styles.filterBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by title, location or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className={styles.select}
          style={{ width: "auto", minWidth: "180px" }}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories ({projects.length})</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Projects Table */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>
            Projects Directory ({filteredProjects.length})
          </h2>
          <span style={{ fontSize: "0.75rem", color: "#666" }}>
            Reorder projects using Up/Down arrows to control display order
          </span>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "60px" }}>Order</th>
                <th style={{ width: "80px" }}>Cover</th>
                <th>Title & Slug</th>
                <th>Category</th>
                <th>Year</th>
                <th>Location</th>
                <th>Homepage</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project, index) => (
                <tr key={project.slug}>
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
                          disabled={index === filteredProjects.length - 1}
                          onClick={() => handleMove(index, "down")}
                          title="Move down"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ width: "54px", height: "36px", position: "relative", borderRadius: "4px", overflow: "hidden", background: "#f0f0f0" }}>
                      <Image src={project.heroImage} alt={project.title} fill sizes="54px" style={{ objectFit: "cover" }} />
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "#111" }}>{project.title}</div>
                    <code style={{ fontSize: "0.72rem", color: "#666" }}>/projects/{project.slug}</code>
                  </td>
                  <td>{project.category}</td>
                  <td>{project.year}</td>
                  <td>{project.location}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(project)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      title="Toggle homepage featured status"
                    >
                      <span className={`${styles.badge} ${project.featured ? styles.badgeAccent : styles.badgeMuted}`}>
                        {project.featured ? "Featured" : "Standard"}
                      </span>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggleVisible(project)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      <span className={`${styles.badge} ${project.visible ? styles.badgeSuccess : styles.badgeMuted}`}>
                        {project.visible ? "Published" : "Hidden"}
                      </span>
                    </button>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "6px" }}>
                      <a
                        href={`/projects/${project.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}
                        title="View live project page"
                      >
                        Preview ↗
                      </a>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}
                        onClick={() => openEditModal(project)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                        onClick={() => setDeleteConfirmSlug(project.slug)}
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

      {/* Project Editor Modal */}
      {editorOpen && editingProject && (
        <div className={styles.modalOverlay} onClick={() => setEditorOpen(false)}>
          <div className={styles.modalContent} style={{ maxWidth: "840px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {isNew ? "Create Architectural Project" : `Edit Project: ${editingProject.title}`}
              </h3>
              <button type="button" className={styles.closeBtn} onClick={() => setEditorOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProject}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Project Title</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={editingProject.title}
                    onChange={(e) => {
                      const t = e.target.value;
                      const s = isNew
                        ? t.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_+|_+$/g, "")
                        : editingProject.slug;
                      setEditingProject({ ...editingProject, title: t, slug: s });
                    }}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>URL Slug</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={editingProject.slug}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        slug: e.target.value.toUpperCase().replace(/[^A-Z0-9_]+/g, ""),
                      })
                    }
                    disabled={!isNew}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Subtitle / Editorial Tagline</label>
                <input
                  type="text"
                  className={styles.input}
                  value={editingProject.subtitle}
                  placeholder="e.g. A quiet residential refuge anchored by laterite and filtered daylight."
                  onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Year</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={editingProject.year}
                    onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Location</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={editingProject.location}
                    placeholder="Kannur, Kerala, India"
                    onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Built-up Area</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={editingProject.area}
                    placeholder="3,263 sqft"
                    onChange={(e) => setEditingProject({ ...editingProject, area: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Principal Architects</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={editingProject.leadArchitects || ""}
                    placeholder="Hafeez & Arjun"
                    onChange={(e) => setEditingProject({ ...editingProject, leadArchitects: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Photography Credits</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={editingProject.photography}
                    placeholder="Abhimanyu KV"
                    onChange={(e) => setEditingProject({ ...editingProject, photography: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Cover Photo */}
              <div className={styles.formGroup} style={{ border: "1px solid #ebebeb", padding: "16px", borderRadius: "8px", background: "#fbfbfb" }}>
                <label className={styles.label}>Cover Hero Photography</label>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{ width: "120px", height: "70px", position: "relative", borderRadius: "6px", overflow: "hidden", background: "#ddd" }}>
                    <Image src={editingProject.heroImage} alt={editingProject.title} fill sizes="120px" style={{ objectFit: "cover" }} />
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
                      value={editingProject.heroImage}
                      placeholder="Image URL"
                      onChange={(e) => setEditingProject({ ...editingProject, heroImage: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Summary / Lead Narrative Quote</label>
                <textarea
                  className={styles.textarea}
                  rows={2}
                  value={editingProject.summary}
                  onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                  required
                />
              </div>

              {/* Narrative Sections */}
              <div className={styles.formGroup}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label className={styles.label} style={{ margin: 0 }}>Narrative Chapters</label>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}
                    onClick={() => {
                      const newChapter: ProjectNarrativeSection = {
                        heading: "Chapter Heading",
                        paragraphs: ["Paragraph content describing architectural dialogue..."],
                      };
                      setEditingProject({
                        ...editingProject,
                        narrative: [...editingProject.narrative, newChapter],
                      });
                    }}
                  >
                    + Add Chapter
                  </button>
                </div>

                {editingProject.narrative.map((chapter, cIdx) => (
                  <div
                    key={cIdx}
                    style={{
                      border: "1px solid #e5e5e5",
                      borderRadius: "6px",
                      padding: "14px",
                      marginBottom: "12px",
                      background: "#fafafa",
                    }}
                  >
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
                      <input
                        type="text"
                        className={styles.input}
                        value={chapter.heading}
                        placeholder="Chapter Heading"
                        onChange={(e) => {
                          const updated = [...editingProject.narrative];
                          updated[cIdx].heading = e.target.value;
                          setEditingProject({ ...editingProject, narrative: updated });
                        }}
                      />
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                        onClick={() => {
                          const updated = editingProject.narrative.filter((_, idx) => idx !== cIdx);
                          setEditingProject({ ...editingProject, narrative: updated });
                        }}
                      >
                        Remove
                      </button>
                    </div>

                    <textarea
                      className={styles.textarea}
                      rows={3}
                      value={chapter.paragraphs.join("\n\n")}
                      placeholder="Write paragraphs separated by double enter..."
                      onChange={(e) => {
                        const updated = [...editingProject.narrative];
                        updated[cIdx].paragraphs = e.target.value.split("\n\n").filter(Boolean);
                        setEditingProject({ ...editingProject, narrative: updated });
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Gallery Images */}
              <div className={styles.formGroup} style={{ border: "1px solid #ebebeb", padding: "16px", borderRadius: "8px", background: "#fbfbfb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div>
                    <label className={styles.label} style={{ margin: 0 }}>
                      Project Gallery Photographs ({editingProject.gallery.length})
                    </label>
                    <span style={{ fontSize: "0.72rem", color: "#666" }}>
                      Upload photographs or edit captions and aspect ratios
                    </span>
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryUpload}
                      disabled={uploadingGallery}
                      style={{ fontSize: "0.8rem" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
                  {editingProject.gallery.map((img, gIdx) => (
                    <div
                      key={gIdx}
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        overflow: "hidden",
                        background: "#fff",
                        padding: "8px",
                      }}
                    >
                      <div style={{ height: "110px", position: "relative", borderRadius: "4px", overflow: "hidden", marginBottom: "8px" }}>
                        <Image src={img.src} alt={img.alt} fill sizes="220px" style={{ objectFit: "cover" }} />
                      </div>
                      <input
                        type="text"
                        className={styles.input}
                        style={{ fontSize: "0.75rem", padding: "4px 8px", marginBottom: "6px" }}
                        placeholder="Caption"
                        value={img.caption || ""}
                        onChange={(e) => {
                          const updated = [...editingProject.gallery];
                          updated[gIdx].caption = e.target.value;
                          setEditingProject({ ...editingProject, gallery: updated });
                        }}
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <select
                          className={styles.select}
                          style={{ fontSize: "0.72rem", padding: "3px 6px", width: "auto" }}
                          value={img.aspectRatio || "landscape"}
                          onChange={(e) => {
                            const updated = [...editingProject.gallery];
                            updated[gIdx].aspectRatio = e.target.value as any;
                            setEditingProject({ ...editingProject, gallery: updated });
                          }}
                        >
                          <option value="landscape">Landscape</option>
                          <option value="portrait">Portrait</option>
                          <option value="wide">Wide Full</option>
                        </select>
                        <button
                          type="button"
                          className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                          onClick={() => {
                            const updated = editingProject.gallery.filter((_, idx) => idx !== gIdx);
                            setEditingProject({ ...editingProject, gallery: updated });
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Toggles */}
              <div style={{ display: "flex", gap: "24px", margin: "20px 0" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={editingProject.visible}
                    onChange={(e) => setEditingProject({ ...editingProject, visible: e.target.checked })}
                  />
                  <span>Published (Visible publicly)</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={editingProject.featured}
                    onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                  />
                  <span>Featured on Homepage (Page 03)</span>
                </label>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "24px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => setEditorOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  disabled={uploadingCover || uploadingGallery}
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmSlug && (
        <div className={styles.modalOverlay} onClick={() => setDeleteConfirmSlug(null)}>
          <div className={styles.modalContent} style={{ maxWidth: "420px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle} style={{ color: "#dc2626" }}>
                Delete this project?
              </h3>
              <button type="button" className={styles.closeBtn} onClick={() => setDeleteConfirmSlug(null)}>
                ✕
              </button>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#444", lineHeight: 1.5 }}>
              Are you sure you want to delete project <strong>&quot;{deleteConfirmSlug}&quot;</strong>? This action cannot be undone and will remove associated project routes and media records.
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
                Yes, Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
