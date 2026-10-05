import Link from 'next/link';
import Image from 'next/image';

export default function Projects() {
  return (
    <section className="section" id="projects" aria-labelledby="projects-title" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head">
          <h2 id="projects-title">Selected projects</h2>
          <p>Homes, workplaces and public buildings.</p>
        </div>
        <div className="grid projects-grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
          <style>{`
            @media (min-width: 901px) {
              .projects-grid .card { grid-column: span 4; }
            }
          `}</style>
          <article className="card">
            <Link href="/projects/HAVEN">
              <div className="ph r-11" aria-hidden="true" style={{ position: 'relative' }}>
                <Image
                  src="/projects/HAVEN/1-opt.jpg"
                  alt="HAVEN"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3>HAVEN</h3>
              <p className="meta">Architecture & Interiors · 2025</p>
            </Link>
          </article>
          <article className="card">
            <Link href="/projects/MAUSAM_THE_HOUSE_OF_SEASONS">
              <div className="ph r-11" aria-hidden="true" style={{ position: 'relative' }}>
                <Image
                  src="/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_15-opt.jpg"
                  alt="Mausam - The House of Seasons"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3>Mausam - The House of Seasons</h3>
              <p className="meta">Architecture · 2024</p>
            </Link>
          </article>
          <article className="card">
            <Link href="/projects/RESIDENCE_AT_EDAVANNA">
              <div className="ph r-11" aria-hidden="true" style={{ position: 'relative' }}>
                <Image
                  src="/projects/RESIDENCE_AT_EDAVANNA/Q14-opt.jpg"
                  alt="Residence at Edavanna"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3>Residence at Edavanna</h3>
              <p className="meta">Architecture · 2024</p>
            </Link>
          </article>
        </div>
        <div className="section-foot">
          <Link className="btn" href="/projects">View all projects</Link>
        </div>
      </div>
    </section>
  );
}