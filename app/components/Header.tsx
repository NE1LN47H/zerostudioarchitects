"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="site-header">
      <div className="bar">
        <Link className="logo" href="/#top" aria-label="Zero Studio Architectures, home">
          <img src="/ZERO-LOGO.png" alt="Zero Studio" style={{ height: '24px', width: 'auto' }} />
        </Link>
        <nav id="primary-nav" aria-label="Primary">
          <ul className="nav-list nav-left">
            <li><Link href="/#projects" onClick={() => setOpen(false)}>Projects</Link></li>
            <li><Link href="/#about" onClick={() => setOpen(false)}>About</Link></li>
            <li><Link href="/awards" onClick={() => setOpen(false)}>Awards</Link></li>
          </ul>
          <ul className="nav-list nav-right">
            <li><Link href="/#journal" onClick={() => setOpen(false)}>Journal</Link></li>
            <li><Link href="/#contact" onClick={() => setOpen(false)}>Contact</Link></li>
          </ul>
        </nav>
        <button 
          className="menu-btn" 
          type="button" 
          aria-expanded={open} 
          aria-controls="primary-nav" 
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
            <path d="M4 8h16M4 16h16" />
          </svg>
        </button>
      </div>
      <style jsx global>{`
        body.nav-open .site-header nav {
          display: block;
        }
      `}</style>
    </header>
  );
}