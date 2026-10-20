"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./Preloader.module.css";

export default function Preloader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    // Skip in admin area
    if (pathname?.startsWith("/admin")) {
      setRemoved(true);
      return;
    }

    // Elegant, brief preloader duration
    const timer = setTimeout(() => {
      setLoading(false);
    }, 750);

    // Completely remove from DOM after fade-out transition
    const removeTimer = setTimeout(() => {
      setRemoved(true);
    }, 1250);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [pathname]);

  if (removed || pathname?.startsWith("/admin")) return null;

  return (
    <div
      className={`${styles.preloader} ${!loading ? styles.fadeOut : ""}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999999,
        backgroundColor: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: loading ? "all" : "none",
        opacity: loading ? 1 : 0,
        visibility: loading ? "visible" : "hidden",
        transition: "opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.45s ease",
      }}
      aria-hidden={!loading}
      role="status"
      aria-label="Loading Zero Studio"
    >
      <div
        className={styles.centerBlock}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          margin: "auto",
        }}
      >
        <span
          className={styles.title}
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: "1.125rem",
            fontWeight: 500,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#111111",
            display: "block",
            textAlign: "center",
          }}
        >
          ZERO STUDIO
        </span>
        <div
          className={styles.line}
          style={{
            width: "36px",
            height: "1px",
            backgroundColor: "#111111",
            marginTop: "14px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
