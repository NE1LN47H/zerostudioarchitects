"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer({ forceShow }: { forceShow?: boolean }) {
  const pathname = usePathname();
  if ((pathname === "/" || pathname?.startsWith("/admin")) && !forceShow) return null;
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot">
          <div className="left">
            <p className="brand">Zero Studio Architectures</p>
            <p>Eranhippalam P.O, Nadakkave, Kozhikode</p>
          </div>
          <nav aria-label="Footer">
            <ul>
              <li><Link href="/#projects">Projects</Link></li>
              <li><Link href="/#about">About</Link></li>
              <li><Link href="/awards">Awards</Link></li>
              <li><Link href="/#journal">Journal</Link></li>
              <li><Link href="/#contact">Contact</Link></li>
            </ul>
          </nav>
          <div className="right">
            <a href="mailto:mail@zerostudio.org">mail@zerostudio.org</a>
            <a href="https://www.instagram.com/zerostudioofficial" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.facebook.com/zerostudioofficial/" target="_blank" rel="noopener noreferrer">Facebook</a>
          </div>
        </div>
        <p className="legal">&copy; {new Date().getFullYear()} Zero Studio Architectures</p>
      </div>
    </footer>
  );
}