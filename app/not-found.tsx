import Link from "next/link";

export default function NotFound() {
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
          Error 404
        </span>
        <h1
          style={{
            fontFamily: "var(--serif, Arial, Helvetica, sans-serif)",
            fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
            fontWeight: 400,
            lineHeight: 1.15,
            margin: "0 0 20px 0",
            color: "var(--ink, #111111)",
          }}
        >
          Page Not Found
        </h1>
        <p
          style={{
            fontSize: "1.0625rem",
            lineHeight: 1.6,
            color: "var(--ink-2, #555555)",
            margin: "0 0 36px 0",
          }}
        >
          The page or project you are looking for does not exist or may have been relocated.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.8125rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--ink, #111111)",
            textDecoration: "none",
            borderBottom: "1px solid var(--ink, #111111)",
            paddingBottom: "4px",
            transition: "opacity 0.2s ease",
          }}
        >
          <span>Return to Studio Overview</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </main>
  );
}
