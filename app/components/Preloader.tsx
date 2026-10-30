"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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

    // Brief, elegant preloader duration for logo fade-in
    const timer = setTimeout(() => {
      setLoading(false);
    }, 950);

    // Completely remove from DOM after fade-out transition
    const removeTimer = setTimeout(() => {
      setRemoved(true);
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [pathname]);

  if (removed || pathname?.startsWith("/admin")) return null;

  return (
    <div
      className={`${styles.preloader} ${!loading ? styles.fadeOut : ""}`}
      aria-hidden={!loading}
      role="status"
      aria-label="Loading Zero Studio"
    >
      <div className={styles.centerBlock}>
        <div className={styles.logoWrap}>
          <Image
            src="/ZERO-LOGO.png"
            alt="Zero Studio"
            width={360}
            height={160}
            priority
            className={styles.logoImage}
          />
        </div>
      </div>
    </div>
  );
}

