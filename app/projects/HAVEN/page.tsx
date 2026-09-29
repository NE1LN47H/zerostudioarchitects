
export default function ProjectPage() {
  const htmlContent = "﻿<p>Name : HAVEN</p><p>Year : 2025</p><p>Area: 3263 sqft</p><p>Location: Kannur,Kerala,India</p><p>Photography: Abhimanyu KV</p><p>The house reflects the firmΓÇÖs design philosophy of simplicity and material restraint, expressed through a quiet palette of laterite, cement plaster, and minimal finishes. Conceived as a linear volume on an elevated site, the design resists dominating its context, instead integrating a laterite wall that serves both as compound and building skin along the eastern edge, anchoring the common areas.</p><p>Approached from the south, the house presents an earthy, grounded character with a sloping tiled roof that subtly references vernacular architecture. A floating sit-out with tropical planting and a simple wooden bench offers a calm threshold, while layered levels extend into a porch terrace that frames elevated views.</p><p>Inside, spaces unfold linearly- living and dining flow into an expanded kitchen, while private bedrooms branch off to the west, buffered by a family living space and staircase. The layout remains open yet selectively screened for privacy. Upstairs, a double-height overlook connects to informal seating and additional bedrooms.</p><p>Natural ventilation and filtered daylight animate the interiors through large openings and the perforated laterite envelope, allowing the house to engage its site with quiet sensitivity and climatic responsiveness.</p>\r\n";

  return (
    <main id="main">
      <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
        <section className="section intro" aria-label="Introduction">
          <div className="wrap">
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--serif)', marginBottom: '32px', textAlign: 'center' }}>
              HAVEN
            </h1>
            <div 
              className="project-content" 
              dangerouslySetInnerHTML={{ __html: htmlContent }} 
              style={{ maxWidth: '48em', margin: '0 auto', color: 'var(--ink-2)', fontSize: '1.0625rem', lineHeight: '1.8' }}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
  