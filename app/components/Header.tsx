"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import { useSection, SECTIONS } from "../context/SectionContext";

interface NavLinkItem {
  href: string;
  label: string;
  id: string;
}

const LINKS: NavLinkItem[] = [
  { href: "/", label: "Home", id: "home" },
  { href: "/#about", label: "About", id: "about" },
  { href: "/#projects", label: "Projects", id: "projects" },
  { href: "/awards", label: "Recognition", id: "awards" },
  { href: "/media", label: "In the Media", id: "media" },
  { href: "/#contact", label: "Reach Us", id: "contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { currentIndex, goToSection, isHome } = useSection();

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

  if (pathname?.startsWith("/admin")) return null;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: NavLinkItem) => {
    if (isHome) {
      e.preventDefault();
      const targetIdx = SECTIONS.findIndex((s) => s.id === link.id);
      if (targetIdx !== -1) {
        goToSection(targetIdx);
      }
      setOpen(false);
    } else {
      setOpen(false);
    }
  };

  const isCurrentActive = (linkId: string) => {
    if (!isHome) return false;
    return SECTIONS[currentIndex]?.id === linkId;
  };

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link
          href="/#about"
          className={styles.logo}
          aria-label="Zero Studio Architectures, about"
          onClick={(e) => {
            if (isHome) {
              e.preventDefault();
              const targetIdx = SECTIONS.findIndex((s) => s.id === "about");
              if (targetIdx !== -1) {
                goToSection(targetIdx);
              }
              setOpen(false);
            } else {
              setOpen(false);
            }
          }}
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
            {LINKS.map((link) => {
              const active = isCurrentActive(link.id);
              return (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className={active ? styles.activeLink : undefined}
                    onClick={(e) => handleLinkClick(e, link)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
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
          <span className={styles.menuIcon} data-open={open} aria-hidden="true">
            <span className={styles.menuLine} />
            <span className={styles.menuLine} />
          </span>
        </button>
      </div>
    </header>
  );
}