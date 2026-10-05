import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Awards & Recognitions — Zero Studio Architectures",
  description: "National and state architectural awards, citations and honors received by Zero Studio Architectures since 2013.",
};

const ALL_RECOGNITIONS = [
  {
    project: "HAVEN, Kannur, Kerala",
    year: "2026",
    awards: [
      "Vanitha Veedu Architectural Awards 2026 - Silver: Category Residential Interior"
    ]
  },
  {
    project: "Screen: the LANTERN house, Tirur, Kerala",
    year: "2023 - 2024",
    awards: [
      "Vanitha Veedu Architectural Awards 2024 - Silver: Category Residential",
      "IIID Kerala Regional Chapter Awards 2023 - Runner up: Category Residential",
      "IIA Kerala State Awards for Excellence in Architecture 2023 - Commendation: Category Residential Interior"
    ]
  },
  {
    project: "Reviving the spirit of a place - Story of An Abandoned Laterite Quarry",
    year: "2020 - 2022",
    awards: [
      "Kohler Bold Design Awards 2022 - Winner: Category Landscape Design",
      "IIA Kerala State Awards for Excellence in Architecture 2021 - Gold Leaf: Category Landscape B",
      "IIA Kerala State Awards for Excellence in Architecture 2021 - Silver Leaf: Category Responsible Architecture",
      "IIA National Awards for Excellence in Architecture 2020 - Shortlisted: Landscape Design (Category B)"
    ]
  },
  {
    project: "Edavani : Redefining a Tribal Hamlet, Attappady, Kerala",
    year: "2020 - 2021",
    awards: [
      "IIA National Awards for Excellence In Architecture 2020 - Winner: Category Architecture Unbuilt",
      "IIA Kerala State Awards for Excellence in Architecture 2021 - Shortlisted: Category Architecture Unbuilt"
    ]
  },
  {
    project: "Kadalas - The Sea view cafe, South Beach, Calicut, Kerala",
    year: "2018 - 2023",
    awards: [
      "IIID Kerala Regional Chapter Awards 2023 - Runner up: Category Leisure & Entertainment",
      "IIA Kerala State Awards for Excellence In Architecture 2021 - Commendation: Category Hospitality",
      "Forbes India Design Awards 2019: 'Best Retail & Hospitality Interiors' - Special Commendation",
      "IID Design Excellence Awards 2019 (Winner Zone 1) - Leisure & Entertainment",
      "IID Design Excellence Awards 2019: Runner up (National) - Leisure & Entertainment",
      "The Merit List 2018-19",
      "IIA National Awards For Excellence In Architecture 2018 - Shortlisted: Interior (Non-Residential)"
    ]
  },
  {
    project: "Mausam - The house of seasons",
    year: "2017 - 2019",
    awards: [
      "The Merit List 2018-19",
      "Ace Architect - Ace Alpha Awards 2017: Winner - Residential Affordable",
      "NDTV Design and Architecture Awards 2017 - Nomination: Architecture Award - House"
    ]
  },
  {
    project: "Residence for Mr. Biju Mathew, Perinthalmanna, Kerala",
    year: "2017",
    awards: [
      "Vanitha Veedu Architecture Awards 2017: Award for Best Renovated House - Winner"
    ]
  },
  {
    project: "Green Lattice - The Tower of Remembrance; Seethi Haji Memorial Cultural Center, Malappuram",
    year: "2014 - 2016",
    awards: [
      "Artist in Concrete Asia 2015-16 - Shortlisted",
      "IIA National Awards for Excellence in Architecture 2015 - Commendation for 'Architecture Unbuilt'",
      "Archi Design Awards for Excellence in Architecture 2015 - Winner",
      "Foundation for Architectural & Environmental Awareness - Best Unbuilt Design 2014",
      "IIA Kerala State Awards for Excellence in Architecture 2014 - Shortlisted"
    ]
  },
  {
    project: "The Temple of Knowledge: A Tribute to the father of Malayalam, Tirur, Kerala",
    year: "2014 - 2016",
    awards: [
      "IIA National Awards for Excellence in Architecture 2016 - Shortlisted: Architecture Unbuilt",
      "IIA Kerala State Awards for Excellence in Architecture 2014 - Commendation"
    ]
  },
  {
    project: "A Reminiscing Walk through Valiyangadi: history that is retained and revived, Malappuram",
    year: "2013 - 2016",
    awards: [
      "IIA National Awards for Excellence in Architecture 2016 - Shortlisted",
      "IIA-Royale State Awards for Excellence in Architecture 2013 - Golden Leaf Award"
    ]
  }
];

const OTHER_RECOGNITIONS = [
  "2024: IIA National award for the best Young architect from Kerala Chapter",
  "2023: ID Honours Award for 2023: Category - Biophilic Design",
  "2023: i-GEN Design Forum-2023: Listing for the most promising top 50 gen-next architects by 'Architect and Interiors India' magazine",
  "2018: Selected among the '20 under 35' in the 8th edition of Design X Design Annual Exhibition",
  "2018: The 'Startup of the year Award 2018' by Saint-Gobain & Economic Times - Smart Green Summit",
  "2017: Vanitha Veedu Architecture Awards 2017: Award for the Best Young Architect",
  "2016: i-GEN Design Forum-2016: Listing for the most promising top 50 gen-next architects by 'Architect and Interiors India' magazine"
];

export default function AwardsPage() {
  return (
    <main id="main" style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg, #ffffff)' }}>
      <div className="wrap" style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 40px 100px' }}>
        <header style={{ marginBottom: '56px' }}>
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#767676', display: 'block', marginBottom: '12px' }}>
            Zero Studio (Estd 2013)
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontFamily: 'var(--serif)', fontWeight: 400, margin: '0 0 16px 0', lineHeight: 1.1 }}>
            Awards & Recognitions
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--ink-2, #555555)', maxWidth: '640px', margin: 0, lineHeight: 1.6 }}>
            A chronological archive of national and state recognitions, design citations, and architectural honors.
          </p>
        </header>

        <section style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '32px', paddingBottom: '12px', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
            Project Honors
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {ALL_RECOGNITIONS.map((item, idx) => (
              <article key={idx} style={{ paddingBottom: '24px', borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.1875rem', fontWeight: 500, margin: 0, lineHeight: 1.35, color: '#1a1a1a' }}>
                    {item.project}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#888888', letterSpacing: '0.08em', whiteSpace: 'nowrap', marginLeft: '16px' }}>
                    {item.year}
                  </span>
                </div>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', margin: 0, color: 'var(--ink-2, #555555)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                  {item.awards.map((award, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>
                      {award}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
            Studio Citations & Recognitions
          </h2>
          <ul style={{ listStyle: 'disc', paddingLeft: '20px', margin: 0, color: 'var(--ink-2, #555555)', fontSize: '0.9375rem', lineHeight: 1.8 }}>
            {OTHER_RECOGNITIONS.map((rec, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>
                {rec}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
