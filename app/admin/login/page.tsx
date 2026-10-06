"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "../admin.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@zerostudio.org");
  const [password, setPassword] = useState("admin123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin");
      } else {
        setError(data.error || "Authentication failed. Check email & password.");
      }
    } catch {
      setError("Network or server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f7f7",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          borderRadius: "10px",
          border: "1px solid #ebebeb",
          padding: "36px 32px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <Image
            src="/ZERO-LOGO.png"
            alt="Zero Studio Architectures"
            width={140}
            height={55}
            priority
            style={{ height: "auto", margin: "0 auto 12px" }}
          />
          <h1 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#111111", margin: 0 }}>
            Content Management System
          </h1>
          <p style={{ fontSize: "0.8rem", color: "#666666", marginTop: "4px" }}>
            Secure administrative control portal
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: "10px 14px",
              background: "#fee2e2",
              border: "1px solid #fca5a5",
              color: "#991b1b",
              borderRadius: "6px",
              fontSize: "0.8rem",
              marginBottom: "18px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="login-email">
              Admin Email
            </label>
            <input
              id="login-email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className={`${styles.btn} ${styles.btnPrimary}`}
            style={{ width: "100%", justifyContent: "center", padding: "11px", marginTop: "8px" }}
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign in to Dashboard →"}
          </button>
        </form>

        <div
          style={{
            marginTop: "24px",
            paddingTop: "16px",
            borderTop: "1px solid #f0f0f0",
            fontSize: "0.75rem",
            color: "#888888",
            textAlign: "center",
          }}
        >
          Initial test credentials pre-filled. You can configure custom credentials in <code>.env.local</code>.
        </div>
      </div>
    </div>
  );
}
