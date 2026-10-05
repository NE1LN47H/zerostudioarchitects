import Link from 'next/link';
import Image from 'next/image';

export default function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 0,
        backgroundColor: 'var(--bg, #ffffff)',
      }}
    >
      <div className="wrap" style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 40px', width: '100%' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2
            id="projects-title"
            style={{
              fontFamily: "var(--serif, 'Instrument Serif', Georgia, serif)",
              fontSize: 'clamp(2.2rem, 3.2vw, 3rem)',
              fontWeight: 400,
              margin: '0 0 6px 0',
              lineHeight: 1,
            }}
          >
            Selected Projects
          </h2>
          <p style={{ margin: 0, color: 'var(--ink-2, #666666)', fontSize: '0.9375rem' }}>
            Homes, workplaces and public buildings.
          </p>
        </div>

        <div
          className="grid projects-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            width: '100%',
          }}
        >
          <article className="card" style={{ margin: 0 }}>
            <Link href="/projects/HAVEN" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 11',
                  overflow: 'hidden',
                  backgroundColor: '#e5e5e5',
                  marginBottom: '12px',
                }}
              >
                <Image
                  src="/projects/HAVEN/1-opt.jpg"
                  alt="HAVEN"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 500, margin: '0 0 4px 0', letterSpacing: '0.01em' }}>
                HAVEN
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#767676', margin: 0, letterSpacing: '0.02em' }}>
                Architecture & Interiors · 2025
              </p>
            </Link>
          </article>

          <article className="card" style={{ margin: 0 }}>
            <Link href="/projects/MAUSAM_THE_HOUSE_OF_SEASONS" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 11',
                  overflow: 'hidden',
                  backgroundColor: '#e5e5e5',
                  marginBottom: '12px',
                }}
              >
                <Image
                  src="/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_15-opt.jpg"
                  alt="Mausam - The House of Seasons"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 500, margin: '0 0 4px 0', letterSpacing: '0.01em' }}>
                Mausam - The House of Seasons
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#767676', margin: 0, letterSpacing: '0.02em' }}>
                Architecture · 2024
              </p>
            </Link>
          </article>

          <article className="card" style={{ margin: 0 }}>
            <Link href="/projects/RESIDENCE_AT_EDAVANNA" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 11',
                  overflow: 'hidden',
                  backgroundColor: '#e5e5e5',
                  marginBottom: '12px',
                }}
              >
                <Image
                  src="/projects/RESIDENCE_AT_EDAVANNA/Q14-opt.jpg"
                  alt="Residence at Edavanna"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 500, margin: '0 0 4px 0', letterSpacing: '0.01em' }}>
                Residence at Edavanna
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#767676', margin: 0, letterSpacing: '0.02em' }}>
                Architecture · 2024
              </p>
            </Link>
          </article>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <Link
            href="/projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.75rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontWeight: 500,
              color: '#1a1a1a',
              textDecoration: 'none',
              transition: 'opacity 0.2s ease',
            }}
          >
            <span>VIEW ALL PROJECTS</span>
            <span style={{ display: 'inline-block', transition: 'transform 0.25s ease' }}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}