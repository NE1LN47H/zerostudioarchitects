
export default function ProjectPage() {
  const htmlContent = "﻿<p>Name : MAUSAM_THE HOUSE OF SEASONS</p><p>Year : 2017</p><p>Area: 1620 sqft</p><p>Location: Mannarkkad,Kerala,India</p><p>Photography: Hamid MM</p><p>Conceived as a response to the growing misconception that good architecture must appear expensive, the house reclaims simplicity, climatic responsiveness, and vernacular sensibilities. Set within a sloping rubber plantation, it deliberately contrasts its context of ΓÇ£aspirationalΓÇ¥ homes by adopting a modest, honest expression while engaging the public edge.</p><p>Designed for a retired army officer and his family, the home adapts between intimate living for two and larger family gatherings. Spaces are arranged along the contour in three split levels, connected by a central stair, with flexible common areas. Vernacular materials-laterite, terracotta, and timber-along with jalis ensure thermal comfort, ventilation, and dynamic light.</p><p>Blending into its landscape, the house evolves with the seasons-cool within during summers, expressive in monsoons, and gently alive through shifting light and vegetation.</p>\r\n";

  return (
    <main id="main">
      <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
        <section className="section intro" aria-label="Introduction">
          <div className="wrap">
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--serif)', marginBottom: '32px', textAlign: 'center' }}>
              Mausam - The House of Seasons
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
  