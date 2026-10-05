"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export interface SectionMeta {
  id: string;
  number: string;
  name: string;
  label: string;
}

export const SECTIONS: SectionMeta[] = [
  { id: "home", number: "01", name: "HOME", label: "Home" },
  { id: "about", number: "02", name: "ABOUT", label: "About" },
  { id: "projects", number: "03", name: "PROJECTS", label: "Projects" },
  { id: "awards", number: "04", name: "AWARDS", label: "Awards" },
  { id: "journal", number: "05", name: "JOURNAL", label: "Journal" },
  { id: "contact", number: "06", name: "CONTACT", label: "Contact" },
];

interface SectionContextType {
  currentIndex: number;
  previousIndex: number;
  direction: "next" | "prev";
  isAnimating: boolean;
  goToSection: (index: number) => void;
  nextSection: () => void;
  prevSection: () => void;
  canNext: boolean;
  canPrev: boolean;
  isHome: boolean;
  setIsAnimating: (val: boolean) => void;
}

const SectionContext = createContext<SectionContextType | null>(null);

export function SectionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSection = useCallback(
    (targetIndex: number) => {
      if (targetIndex === currentIndex || isAnimating) return;
      if (targetIndex < 0 || targetIndex >= SECTIONS.length) return;

      if (!isHome) {
        // If on a subpage (e.g. /journal/[slug]), navigate to home
        router.push(`/?section=${SECTIONS[targetIndex].id}`);
        return;
      }

      setDirection(targetIndex > currentIndex ? "next" : "prev");
      setPreviousIndex(currentIndex);
      setCurrentIndex(targetIndex);
      setIsAnimating(true);
    },
    [currentIndex, isAnimating, isHome, router]
  );

  const nextSection = useCallback(() => {
    if (currentIndex < SECTIONS.length - 1) {
      goToSection(currentIndex + 1);
    }
  }, [currentIndex, goToSection]);

  const prevSection = useCallback(() => {
    if (currentIndex > 0) {
      goToSection(currentIndex - 1);
    }
  }, [currentIndex, goToSection]);

  const canNext = currentIndex < SECTIONS.length - 1;
  const canPrev = currentIndex > 0;

  // Sync initial hash on mount if on homepage
  useEffect(() => {
    if (!isHome || typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "").toLowerCase();
    const querySection = new URLSearchParams(window.location.search).get("section");
    const target = querySection || hash;
    if (target) {
      const foundIdx = SECTIONS.findIndex((s) => s.id === target);
      if (foundIdx > 0) {
        setCurrentIndex(foundIdx);
        setPreviousIndex(0);
      }
    }
  }, [isHome]);

  // Update hash when currentIndex changes
  useEffect(() => {
    if (!isHome || typeof window === "undefined") return;
    const currentId = SECTIONS[currentIndex]?.id;
    if (currentId) {
      const newHash = currentId === "home" ? "" : `#${currentId}`;
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, "", newHash || window.location.pathname);
      }
    }
  }, [currentIndex, isHome]);

  // Keyboard navigation: ArrowRight / ArrowLeft
  useEffect(() => {
    if (!isHome) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "ArrowRight") {
        nextSection();
      } else if (e.key === "ArrowLeft") {
        prevSection();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isHome, nextSection, prevSection]);

  return (
    <SectionContext.Provider
      value={{
        currentIndex,
        previousIndex,
        direction,
        isAnimating,
        goToSection,
        nextSection,
        prevSection,
        canNext,
        canPrev,
        isHome,
        setIsAnimating,
      }}
    >
      {children}
    </SectionContext.Provider>
  );
}

export function useSection() {
  const ctx = useContext(SectionContext);
  if (!ctx) {
    throw new Error("useSection must be used within a SectionProvider");
  }
  return ctx;
}
