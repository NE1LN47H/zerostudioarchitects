import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PROJECTS_DATA } from "./data";

export const metadata: Metadata = {
  title: "Projects — Zero Studio Architectures",
  description: "Selected architectural, residential, commercial and cultural projects by Zero Studio Architectures.",
};

export default function ProjectsPage() {
  return (
    <main id="main" style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg, #ffffff)' }}>
      <div className="wrap" style={{ maxWidth: '1440px', margin: '0 auto', padding: '48px 40px 100px' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8125rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#767676',
            textDecoration: 'none',
            marginBottom: '28px',
            transition: 'color 0.2s ease',
          }}
        >
          <span aria-hidden="true">←</span>
          <span>Back to Home</span>
        </Link>

        <header style={{ marginBottom: '56px' }}>
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#767676', display: 'block', marginBottom: '12px' }}>
            Portfolio
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontFamily: 'var(--serif)', fontWeight: 400, margin: '0 0 16px 0', lineHeight: 1.1 }}>
            All Projects
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--ink-2, #555555)', maxWidth: '640px', margin: 0, lineHeight: 1.6 }}>
            Homes, cultural spaces, landscapes and hospitality projects designed with context, climate and honest materials.
          </p>
        </header>

        <style>{`
          .project-card-img {
            object-fit: cover;
            transform: scale(1);
            transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .card a:hover .project-card-img {
            transform: scale(1.035);
          }
        `}</style>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '48px 32px' }}>
          {PROJECTS_DATA.map((proj) => (
            <article key={proj.slug} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <Link href={`/projects/${proj.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 11', overflow: 'hidden', backgroundColor: '#f0f0f0', marginBottom: '18px' }}>
                  <Image
                    src={proj.heroImage}
                    alt={proj.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="project-card-img"
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 500, margin: 0, letterSpacing: '0.01em' }}>
                    {proj.title}
                  </h2>
                  <span style={{ fontSize: '0.8125rem', color: '#888888', letterSpacing: '0.08em' }}>
                    {proj.year}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#666666', margin: '0 0 4px 0', letterSpacing: '0.02em' }}>
                  {proj.category}
                </p>
                <p style={{ fontSize: '0.8125rem', color: '#999999', margin: 0 }}>
                  {proj.location} · {proj.area}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
