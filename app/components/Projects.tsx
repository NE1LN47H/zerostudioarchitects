import Link from 'next/link';

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
              <div className="ph r-11" aria-hidden="true"></div>
              <h3>HAVEN</h3>
              <p className="meta">Architecture & Interiors</p>
            </Link>
          </article>
          <article className="card">
            <Link href="/projects/MAUSAM_THE_HOUSE_OF_SEASONS">
              <div className="ph r-11" aria-hidden="true"></div>
              <h3>Mausam - The House of Seasons</h3>
              <p className="meta">Architecture</p>
            </Link>
          </article>
          <article className="card">
            <Link href="/projects/RESIDENCE_AT_EDAVANNA">
              <div className="ph r-11" aria-hidden="true"></div>
              <h3>Residence at Edavanna</h3>
              <p className="meta">Architecture</p>
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