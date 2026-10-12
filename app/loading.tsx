export default function Loading() {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg, #ffffff)",
      }}
      aria-live="polite"
      aria-busy="true"
    >
      <div
        style={{
          fontSize: "0.75rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#999999",
        }}
      >
        Loading...
      </div>
    </div>
  );
}
