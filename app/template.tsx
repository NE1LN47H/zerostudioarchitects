"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [fadedIn, setFadedIn] = useState(false);

  useEffect(() => {
    // Fade in from clean blank white on route transition
    const raf = requestAnimationFrame(() => {
      setFadedIn(true);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {/* Blank white transition veil that smoothly reveals incoming page */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#ffffff",
          zIndex: 9999,
          pointerEvents: "none",
          opacity: fadedIn ? 0 : 1,
          transition: "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        aria-hidden="true"
      />
    </>
  );
}
