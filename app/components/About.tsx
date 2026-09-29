export default function About() {
  return (
    <section className="section intro" id="about" aria-label="Introduction">
      <div className="wrap">
        <div className="section-head" style={{ marginBottom: '32px' }}>
          <h2 id="studio-title">The Studio</h2>
        </div>
        <div style={{ maxWidth: '48em', margin: '0 auto', color: 'var(--ink-2)', fontSize: '1.0625rem', display: 'flex', flexDirection: 'column', gap: '16px', lineHeight: '1.8' }}>
          <p>Zero studio is a creative design studio driving itself forward with a perception to experiment with architecture under the varying contexts of need and, most importantly, the user. Founded in 2013 by the visionary duo Ar.Hamid MM & Ar.Hafeef PK, the studio is now led by Ar.Shabna & Ar.Nidhinraj KJ.</p>
          <p>We approach every project as a unique opportunity to converse with nature, finding an adaptive balance between functionality, aesthetics, context, climate, and materials. We love to call our practice an art studio, where the character of our designs varies vibrantly, never restricted by a single ideology, allowing architecture to remain a subtle, evolving blend of ideas.</p>
        </div>
      </div>
    </section>
  );
}