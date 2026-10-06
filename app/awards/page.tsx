import type { Metadata } from "next";
import { getAwards } from "@/lib/db/service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Awards & Recognitions — Zero Studio Architectures",
  description: "National and state architectural awards, citations and honors received by Zero Studio Architectures since 2013.",
};

export default async function AwardsPage() {
  const dynamicAwards = await getAwards(true);

  // Group dynamic awards from MongoDB
  const projectItems = dynamicAwards.filter((a) => a.type === "project" || a.type === "curated" || !a.type);
  const honorItems = dynamicAwards.filter((a) => a.type === "honor");

  // Group by project name
  const groupedMap = new Map<string, { project: string; year: string; awards: string[] }>();
  for (const item of projectItems) {
    const existing = groupedMap.get(item.project);
    const citation = `${item.organization} - ${item.award}${item.category ? ` (${item.category})` : ""}`;
    if (existing) {
      existing.awards.push(citation);
    } else {
      groupedMap.set(item.project, {
        project: item.project,
        year: item.year,
        awards: [citation],
      });
    }
  }
  const projectHonors = Array.from(groupedMap.values());
  const studioCitations = honorItems.map((h) => `${h.year}: ${h.award}${h.organization ? ` - ${h.organization}` : ""}`);

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
            {projectHonors.map((item, idx) => (
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

        {studioCitations.length > 0 && (
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
              Studio Citations & Recognitions
            </h2>
            <ul style={{ listStyle: 'disc', paddingLeft: '20px', margin: 0, color: 'var(--ink-2, #555555)', fontSize: '0.9375rem', lineHeight: 1.8 }}>
              {studioCitations.map((rec, i) => (
                <li key={i} style={{ marginBottom: '8px' }}>
                  {rec}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
