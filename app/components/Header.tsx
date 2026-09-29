"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

const LINKS = [
  { href: "/#projects", label: "Projects" },
  { href: "/#about", label: "About" },
  { href: "/awards", label: "Awards" },
  { href: "/#journal", label: "Journal" },
  { href: "/#contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  // Close on Escape, and when the viewport grows past the mobile breakpoint
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const mq = window.matchMedia("(min-width: 769px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    mq.addEventListener("change", onChange);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link
          href="/#top"
          className={styles.logo}
          aria-label="Zero Studio Architectures, home"
        >
          {/* Set width/height to your PNG's real pixel size (only the ratio matters) */}
          <Image
            src="/ZERO-LOGO.png"
            alt=""
            width={600}
            height={270}
            priority
            className={styles.logoImg}
          />
        </Link>

        <nav
          id="primary-nav"
          aria-label="Primary"
          className={styles.nav}
          data-open={open}
        >
          <ul className={styles.list}>
            {LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} onClick={() => setOpen(false)}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className={styles.menuBtn}
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
          >
            <path d={open ? "M6 6l12 12M18 6L6 18" : "M4 8h16M4 16h16"} />
          </svg>
        </button>
      </div>
    </header>
  );
}