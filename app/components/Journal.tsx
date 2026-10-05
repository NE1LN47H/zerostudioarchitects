import Link from 'next/link';
import Image from 'next/image';

export default function Journal() {
  return (
    <section
      id="journal"
      aria-labelledby="journal-title"
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
            id="journal-title"
            style={{
              fontFamily: "var(--serif, 'Instrument Serif', Georgia, serif)",
              fontSize: 'clamp(2.2rem, 3.2vw, 3rem)',
              fontWeight: 400,
              margin: '0 0 6px 0',
              lineHeight: 1,
            }}
          >
            Journal
          </h2>
          <p style={{ margin: 0, color: 'var(--ink-2, #666666)', fontSize: '0.9375rem' }}>
            Notes on process, materials and places we&apos;ve worked.
          </p>
        </div>

        <div
          className="grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            width: '100%',
          }}
        >
          <article className="card" style={{ margin: 0 }}>
            <Link
              href="/journal/the-architecture-of-quiet-spaces"
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 10',
                  overflow: 'hidden',
                  backgroundColor: '#e5e5e5',
                  marginBottom: '12px',
                }}
              >
                <Image
                  src="/projects/HAVEN/1-opt.jpg"
                  alt="The Architecture of Quiet Spaces"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 500, margin: '0 0 4px 0', letterSpacing: '0.01em', lineHeight: 1.3 }}>
                The Architecture of Quiet Spaces
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#767676', margin: 0, letterSpacing: '0.02em' }}>
                Architecture & Context · 05 Oct 2026
              </p>
            </Link>
          </article>

          <article className="card" style={{ margin: 0 }}>
            <Link
              href="/journal/tactility-of-laterite-and-exposed-concrete"
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 10',
                  overflow: 'hidden',
                  backgroundColor: '#e5e5e5',
                  marginBottom: '12px',
                }}
              >
                <Image
                  src="/projects/RESIDENCE_AT_EDAVANNA/Q16-opt.jpg"
                  alt="Tactility of Laterite and Exposed Concrete"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 500, margin: '0 0 4px 0', letterSpacing: '0.01em', lineHeight: 1.3 }}>
                Tactility of Laterite & Concrete
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#767676', margin: 0, letterSpacing: '0.02em' }}>
                Material & Craft · 18 Sep 2026
              </p>
            </Link>
          </article>

          <article className="card" style={{ margin: 0 }}>
            <Link
              href="/journal/breathing-walls-and-tropical-microclimates"
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 10',
                  overflow: 'hidden',
                  backgroundColor: '#e5e5e5',
                  marginBottom: '12px',
                }}
              >
                <Image
                  src="/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_18-opt.jpg"
                  alt="Breathing Walls and Tropical Microclimates"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 500, margin: '0 0 4px 0', letterSpacing: '0.01em', lineHeight: 1.3 }}>
                Breathing Walls in the Tropics
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#767676', margin: 0, letterSpacing: '0.02em' }}>
                Climate Responsive · 28 Aug 2026
              </p>
            </Link>
          </article>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <Link
            href="/journal"
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
            <span>VIEW ALL JOURNAL</span>
            <span style={{ display: 'inline-block', transition: 'transform 0.25s ease' }}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}