export default function ProjectPage() {
  const htmlContent = `
    <p><strong>Name:</strong> RESIDENCE AT EDAVANNA</p>
    <p><strong>Year:</strong> 2024</p>
    <p><strong>Area:</strong> 3014 SQFT</p>
    <p><strong>Location:</strong> Edavanna, Kerala, India</p>
    <p><strong>Client:</strong> Mr. Ashiq &amp; Mrs. Sibla</p>
    <p><strong>Photography:</strong> Edwin James</p>

    <p>
      Set within a landscape reminiscent of 1980s Kerala homes, the residence
      sits at the heart of a generous plot, allowing space for gardens, kitchen
      cultivation, and meaningful ecological life beyond ornamentation. Evoking
      the quiet charm of a Sathyan Anthikkad setting, the house is designed for
      a young family choosing to live close to their roots, with the husband’s
      ancestral home accessible from the backyard.
    </p>

    <p>
      Positioned away from the boundaries, the design prioritizes openness and
      greenery. The plan is largely ground-oriented, with essential functions
      below and minimal spaces above. Organized along an axial layout, courtyards
      and passages divide the home into zones of varying privacy. These courtyards
      introduce light, air, and moments of pause, while the restrained material
      palette reinforces a warm, humble character tailored to everyday living.
    </p>
  `;

  return (
    <main id="main">
      <div
        style={{
          paddingTop: "80px",
          minHeight: "100vh",
        }}
      >
        <section
          className="section intro"
          aria-label="Introduction"
        >
          <div className="wrap">
            <h1
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontFamily: "var(--serif)",
                marginBottom: "32px",
                textAlign: "center",
              }}
            >
              Residence at Edavanna
            </h1>

            <div
              className="project-content"
              dangerouslySetInnerHTML={{
                __html: htmlContent,
              }}
              style={{
                maxWidth: "48em",
                margin: "0 auto",
                color: "var(--ink-2)",
                fontSize: "1.0625rem",
                lineHeight: "1.8",
              }}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

