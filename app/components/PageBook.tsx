"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import Hero from "./Hero";
import About from "./About";
import Projects from "./Projects";
import Awards from "./Awards";
import Journal from "./Journal";
import Contact from "./Contact";
import Footer from "./Footer";
import { useSection, SECTIONS } from "../context/SectionContext";
import styles from "./PageBook.module.css";

export default function PageBook() {
  const {
    currentIndex,
    previousIndex,
    direction,
    isAnimating,
    setIsAnimating,
    goToSection,
    nextSection,
    prevSection,
    canNext,
    canPrev,
  } = useSection();

  // Active sheets tracking for smooth 3D page turn
  const [animatingState, setAnimatingState] = useState<{
    fromIndex: number;
    toIndex: number;
    dir: "next" | "prev";
  } | null>(null);

  // Sync animation state with SectionContext
  useEffect(() => {
    if (isAnimating) {
      setAnimatingState({
        fromIndex: previousIndex,
        toIndex: currentIndex,
        dir: direction,
      });

      const timer = setTimeout(() => {
        setIsAnimating(false);
        setAnimatingState(null);
      }, 760);

      return () => clearTimeout(timer);
    } else {
      setAnimatingState(null);
    }
  }, [currentIndex, previousIndex, direction, isAnimating, setIsAnimating]);

  // Reset scroll position to top when entering a section
  useEffect(() => {
    const activeEl = document.querySelector(`[data-section-index="${currentIndex}"]`);
    if (activeEl) {
      activeEl.scrollTop = 0;
    }
  }, [currentIndex]);

  // Touch Swipe Handling for Mobile (non-blocking for vertical scroll)
  const touchCoords = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchCoords.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchCoords.current || e.touches.length !== 1) return;
    const deltaX = Math.abs(e.touches[0].clientX - touchCoords.current.x);
    const deltaY = Math.abs(e.touches[0].clientY - touchCoords.current.y);
    // If vertical movement is dominant, cancel swipe detection so vertical scrolling is 100% natural
    if (deltaY > 10 && deltaY > deltaX) {
      touchCoords.current = null;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchCoords.current || e.changedTouches.length !== 1) return;
    const deltaX = e.changedTouches[0].clientX - touchCoords.current.x;
    const deltaY = e.changedTouches[0].clientY - touchCoords.current.y;
    const elapsed = Date.now() - touchCoords.current.time;
    touchCoords.current = null;

    // Minimum swipe threshold: 50px horizontal, within 600ms, mostly horizontal
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5 && elapsed < 600) {
      if (deltaX < 0 && canNext) {
        nextSection();
      } else if (deltaX > 0 && canPrev) {
        prevSection();
      }
    }
  };

  const currentSection = SECTIONS[currentIndex] || SECTIONS[0];

  // Render components for each section
  const sectionContent = useMemo(
    () => [
      <Hero key="sec-0" hideBar />,
      <About key="sec-1" />,
      <Projects key="sec-2" />,
      <Awards key="sec-3" />,
      <Journal key="sec-4" />,
      (
        <div key="sec-5" className={styles.contactSheet}>
          <Contact />
          <Footer forceShow />
        </div>
      ),
    ],
    []
  );

  return (
    <div
      className={styles.bookWrapper}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Bar: Editorial Studio Label & Minimal Navigation Arrows */}
      <div className={styles.topBar}>
        <div className={styles.labelGroup}>
          <span className={styles.studioLabel}>THE STUDIO</span>
          <span className={styles.studioLine} aria-hidden="true" />
        </div>

        <div className={styles.arrowGroup} role="group" aria-label="Section navigation">
          <button
            type="button"
            className={styles.arrowBtn}
            onClick={prevSection}
            disabled={!canPrev}
            aria-label="Previous section"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <span className={styles.arrowDivider} aria-hidden="true" />

          <button
            type="button"
            className={styles.arrowBtn}
            onClick={nextSection}
            disabled={!canNext}
            aria-label="Next section"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* 3D Physical Page Turn Stage */}
      <div className={styles.bookStage}>
        {sectionContent.map((content, idx) => {
          let sheetClass = styles.sheet;

          if (animatingState) {
            if (idx === animatingState.fromIndex) {
              // Outgoing page turns
              sheetClass +=
                animatingState.dir === "next"
                  ? ` ${styles.turnNextOutgoing}`
                  : ` ${styles.turnPrevOutgoing}`;
            } else if (idx === animatingState.toIndex) {
              // Incoming page revealed underneath
              sheetClass +=
                animatingState.dir === "next"
                  ? ` ${styles.turnNextIncoming}`
                  : ` ${styles.turnPrevIncoming}`;
            } else {
              sheetClass += ` ${styles.sheetHidden}`;
            }
          } else {
            // Idle state: only current section is visible
            if (idx === currentIndex) {
              sheetClass += ` ${styles.sheetActive}`;
            } else {
              sheetClass += ` ${styles.sheetHidden}`;
            }
          }

          return (
            <div
              key={idx}
              className={sheetClass}
              data-section-index={idx}
              data-lenis-prevent="true"
              tabIndex={0}
              aria-hidden={idx !== currentIndex}
            >
              {content}
            </div>
          );
        })}
      </div>

      {/* Bottom Progress Timeline */}
      <nav className={styles.timeline} aria-label="Section navigation">
        <div className={styles.timelineTrack} aria-hidden="true" />
        <div className={styles.timelineList}>
          {SECTIONS.map((sec, idx) => {
            const isActive = currentIndex === idx;
            return (
              <button
                key={sec.id}
                type="button"
                className={styles.timelineItem}
                data-active={isActive}
                onClick={() => goToSection(idx)}
                aria-label={`Go to section ${sec.number} ${sec.label}`}
                aria-current={isActive ? "page" : undefined}
              >
                <div className={styles.timelineLabel}>
                  <span className={styles.timelineNum}>{sec.number}</span>
                  <span className={styles.timelineName}>{sec.name}</span>
                </div>
                <div className={styles.timelineDotWrap}>
                  <span className={styles.timelineDot} />
                </div>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
