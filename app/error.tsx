"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Zero Studio Application Error:", error);
  }, [error]);

  return (
    <main
      id="main"
      style={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px 80px",
        background: "var(--bg, #ffffff)",
      }}
    >
      <div style={{ maxWidth: "560px", textAlign: "center" }}>
        <span
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#888888",
            display: "block",
            marginBottom: "16px",
          }}
        >
          Notice
        </span>
        <h1
          style={{
            fontFamily: "var(--serif, serif)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 400,
            lineHeight: 1.15,
            margin: "0 0 16px 0",
            color: "var(--ink, #111111)",
          }}
        >
          Something went wrong
        </h1>
        <p
          style={{
            fontSize: "1rem",
            lineHeight: 1.6,
            color: "var(--ink-2, #555555)",
            margin: "0 0 32px 0",
          }}
        >
          An unexpected error occurred while loading this page.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: "10px 20px",
              background: "var(--ink, #111111)",
              color: "#ffffff",
              border: "none",
              fontSize: "0.8125rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
          <Link
            href="/"
            style={{
              padding: "10px 20px",
              background: "transparent",
              color: "var(--ink, #111111)",
              border: "1px solid var(--ink, #111111)",
              fontSize: "0.8125rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
