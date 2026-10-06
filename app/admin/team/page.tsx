"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../admin.module.css";
import { TeamMember } from "@/lib/types";

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const [modalItem, setModalItem] = useState<TeamMember | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadTeam = async () => {
    try {
      const res = await fetch("/api/admin/team");
      if (res.ok) {
        const data = await res.json();
        setTeam(data.team);
      }
    } catch {
      showToast("Error loading team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= team.length) return;

    const newTeam = [...team];
    const temp = newTeam[index];
    newTeam[index] = newTeam[targetIndex];
    newTeam[targetIndex] = temp;

    setTeam(newTeam);

    try {
      const orderedIds = newTeam.map((t) => t.id);
      await fetch("/api/admin/team/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      showToast("Team order saved");
    } catch {
      showToast("Order update failed");
      loadTeam();
    }
  };

  const handleToggleVisible = async (member: TeamMember) => {
    try {
      const updated = !member.visible;
      const res = await fetch(`/api/admin/team/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: updated }),
      });
      if (res.ok) {
        setTeam(team.map((t) => (t.id === member.id ? { ...t, visible: updated } : t)));
        showToast(`Member ${updated ? "visible" : "hidden"}`);
      }
    } catch {
      showToast("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTeam(team.filter((t) => t.id !== id));
        showToast("Team member deleted");
      } else {
        showToast("Failed to delete member");
      }
    } catch {
      showToast("Error deleting member");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handlePortraitUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !modalItem) return;

    setUploading(true);
    showToast("Uploading portrait...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "zerostudio/team");

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setModalItem({
          ...modalItem,
          image: data.asset.url,
          imagePublicId: data.asset.publicId,
        });
        showToast("Portrait uploaded");
      }
    } catch {
      showToast("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalItem) return;

    try {
      if (isNew) {
        const res = await fetch("/api/admin/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(modalItem),
        });
        if (res.ok) {
          showToast("Team member added");
          setModalItem(null);
          loadTeam();
        } else {
          showToast("Failed to add member");
        }
      } else {
        const res = await fetch(`/api/admin/team/${modalItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(modalItem),
        });
        if (res.ok) {
          showToast("Team member updated");
          setModalItem(null);
          loadTeam();
        } else {
          showToast("Failed to update member");
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
          <h1 className={styles.pageTitle}>Studio Architects & Team</h1>
          <p className={styles.pageSubtitle}>
            Manage principal architects, bios, credentials, and studio leadership
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
                name: "Ar. ",
                role: "Lead Architect",
                bio: "",
                order: team.length + 1,
                visible: true,
              });
            }}
          >
            + Add Team Member
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Team Members ({team.length})</h2>
          <span style={{ fontSize: "0.75rem", color: "#666" }}>
            Reorder using Up/Down arrows to control leadership hierarchy
          </span>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "60px" }}>Order</th>
                <th style={{ width: "60px" }}>Portrait</th>
                <th>Name</th>
                <th>Position / Role</th>
                <th>Bio Summary</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {team.map((member, index) => (
                <tr key={member.id}>
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
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          className={styles.btnSm}
                          style={{ border: "1px solid #ddd", background: "#fff", cursor: "pointer", padding: "1px 4px", fontSize: "0.65rem" }}
                          disabled={index === team.length - 1}
                          onClick={() => handleMove(index, "down")}
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#f0f0f0", overflow: "hidden", position: "relative" }}>
                      {member.image ? (
                        <Image src={member.image} alt={member.name} fill sizes="36px" style={{ objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: "#888" }}>
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{member.name}</td>
                  <td>{member.role}</td>
                  <td style={{ maxWidth: "340px", fontSize: "0.78rem", color: "#666" }}>
                    {member.bio ? member.bio.slice(0, 100) + "..." : "—"}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggleVisible(member)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      <span className={`${styles.badge} ${member.visible ? styles.badgeSuccess : styles.badgeMuted}`}>
                        {member.visible ? "Visible" : "Hidden"}
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
                          setModalItem(member);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                        onClick={() => setDeleteConfirmId(member.id)}
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
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {isNew ? "Add Team Member" : `Edit Member: ${modalItem.name}`}
              </h3>
              <button type="button" className={styles.closeBtn} onClick={() => setModalItem(null)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name & Prefix</label>
                <input
                  type="text"
                  className={styles.input}
                  value={modalItem.name}
                  placeholder="e.g. Ar. Hamid MM"
                  onChange={(e) => setModalItem({ ...modalItem, name: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Position / Role</label>
                <input
                  type="text"
                  className={styles.input}
                  value={modalItem.role}
                  placeholder="e.g. Founding Principal Architect"
                  onChange={(e) => setModalItem({ ...modalItem, role: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Portrait Photo (Optional)</label>
                <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePortraitUpload}
                    disabled={uploading}
                    style={{ fontSize: "0.8rem" }}
                  />
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Or portrait URL"
                    value={modalItem.image || ""}
                    onChange={(e) => setModalItem({ ...modalItem, image: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Biography / Studio Narrative</label>
                <textarea
                  className={styles.textarea}
                  rows={4}
                  value={modalItem.bio || ""}
                  placeholder="Brief biography outlining their design role and architectural contributions..."
                  onChange={(e) => setModalItem({ ...modalItem, bio: e.target.value })}
                />
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
                  Save Member
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
                Delete Member?
              </h3>
              <button type="button" className={styles.closeBtn} onClick={() => setDeleteConfirmId(null)}>
                ✕
              </button>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#444" }}>
              Are you sure you want to remove this architect or team member?
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
