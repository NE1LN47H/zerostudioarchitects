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
            <a href="#">
              <div className="ph r-32" aria-hidden="true"></div>
              <h3>Why we draw every plan by hand first</h3>
              <p className="meta">Process, 12 March 2026</p>
            </a>
          </article>
          <article className="card">
            <a href="#">
              <div className="ph r-32" aria-hidden="true"></div>
              <h3>Choosing timber over concrete</h3>
              <p className="meta">Materials, 20 January 2026</p>
            </a>
          </article>
          <article className="card">
            <a href="#">
              <div className="ph r-32" aria-hidden="true"></div>
              <h3>Notes from a site visit</h3>
              <p className="meta">Site, 4 November 2025</p>
            </a>
          </article>
        </div>
        <div className="section-foot">
          <a className="btn" href="#">Read the journal</a>
        </div>
      </div>
    </section>
  );
}