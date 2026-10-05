import Link from 'next/link';
import Image from 'next/image';

export default function Journal() {
  return (
    <section className="section" id="journal" aria-labelledby="journal-title" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head">
          <h2 id="journal-title">Journal</h2>
          <p>Notes on process, materials and places we've worked.</p>
        </div>
        <div className="grid">
          <article className="card">
            <Link href="/journal/the-architecture-of-quiet-spaces">
              <div className="ph r-32" aria-hidden="true" style={{ position: 'relative' }}>
                <Image
                  src="/projects/HAVEN/1-opt.jpg"
                  alt="The Architecture of Quiet Spaces"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3>The Architecture of Quiet Spaces</h3>
              <p className="meta">Architecture & Context, 05 October 2026</p>
            </Link>
          </article>
          <article className="card">
            <Link href="/journal/tactility-of-laterite-and-exposed-concrete">
              <div className="ph r-32" aria-hidden="true" style={{ position: 'relative' }}>
                <Image
                  src="/projects/RESIDENCE_AT_EDAVANNA/Q16-opt.jpg"
                  alt="Tactility of Laterite and Exposed Concrete"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3>Tactility of Laterite and Exposed Concrete</h3>
              <p className="meta">Material & Craft, 18 September 2026</p>
            </Link>
          </article>
          <article className="card">
            <Link href="/journal/breathing-walls-and-tropical-microclimates">
              <div className="ph r-32" aria-hidden="true" style={{ position: 'relative' }}>
                <Image
                  src="/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_18-opt.jpg"
                  alt="Breathing Walls and Tropical Microclimates"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3>Breathing Walls and Tropical Microclimates</h3>
              <p className="meta">Climate Responsive, 28 August 2026</p>
            </Link>
          </article>
        </div>
        <div className="section-foot">
          <Link className="btn" href="/journal">Read the journal</Link>
        </div>
      </div>
    </section>
  );
}