import { getSiteUrl, STUDIO_GEO } from "@/lib/seo/config";
import { getAboutContent, getProjects, getAwards, getPublications, getTeamMembers } from "@/services";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = getSiteUrl();
  const [about, projects, awards, publications, team] = await Promise.all([
    getAboutContent().catch(() => null),
    getProjects(true).catch(() => []),
    getAwards(true).catch(() => []),
    getPublications(true).catch(() => []),
    getTeamMembers(true).catch(() => []),
  ]);

  const p1 =
    about?.paragraph1 ||
    "Zero studio is a creative design studio driving itself forward with a perception to experiment with architecture under the varying contexts of need and, most importantly, the user. Founded in 2013 by the visionary duo Ar.Hamid MM & Ar.Hafeef PK, the studio is now led by Ar.Shabna & Ar.Nidhinraj KJ.";

  const p2 =
    about?.paragraph2 ||
    "We approach every project as a unique opportunity to converse with nature, finding an adaptive balance between functionality, aesthetics, context, climate, and materials. We love to call our practice an art studio, where the character of our designs varies vibrantly, never restricted by a single ideology, allowing architecture to remain a subtle, evolving blend of ideas.";

  const content = `# Zero Studio Architects — Full Architectural Dossier

> Complete contextual archive, architectural catalogue, leadership profile, and press repository for Zero Studio Architects, Kozhikode (Calicut), Kerala.

## Practice Profile
- **Practice Name**: Zero Studio Architects
- **Founding Year**: 2013
- **Founding Partners**: Ar. Hamid MM & Ar. Hafeef PK (1990–2022)
- **Principal Architects**: Ar. Shabna K & Ar. Nidhinraj KJ
- **Headquarters**: ${STUDIO_GEO.streetAddress}, ${STUDIO_GEO.addressLocality}, ${STUDIO_GEO.addressRegion} ${STUDIO_GEO.postalCode}, India
- **Geo Coordinates**: ${STUDIO_GEO.latitude}° N, ${STUDIO_GEO.longitude}° E
- **Official Website**: ${siteUrl}
- **Official Inquiries**: ${STUDIO_GEO.email} | ${STUDIO_GEO.telephone}
- **Social Presence**: Instagram (${STUDIO_GEO.instagramUrl}) | Facebook (${STUDIO_GEO.facebookUrl})

## Studio Narrative & Manifesto
${p1}

${p2}

## Architectural Team
${team
  .map(
    (m) =>
      `- **${m.name}** — ${m.role}${m.bio ? ` (${m.bio})` : ""}`
  )
  .join("\n")}

## Complete Project Archive (${projects.length} Works)
${projects
  .map(
    (p) => `### ${p.title} (${p.year})
- **Slug**: ${p.slug}
- **URL**: ${siteUrl}/projects/${p.slug}
- **Category**: ${p.category || "Architecture"}
- **Location**: ${p.location || "Kerala, India"}
- **Subtitle**: ${p.subtitle || "N/A"}
- **Summary**: ${p.summary || "Contextual architectural work designed by Zero Studio."}
`
  )
  .join("\n")}

## Complete Recognition & Awards Archive (${awards.length} Honors)
${awards
  .map(
    (a) =>
      `- **${a.award}** (${a.year})${a.project ? ` for ${a.project}` : ""}: ${a.organization || ""}${a.category ? ` — Category: ${a.category}` : ""}`
  )
  .join("\n")}

## Selected Press & Media Features (${publications.length} Citations)
${publications
  .map(
    (pub) =>
      `- [${pub.title}](${pub.url || siteUrl}) — Platform: **${pub.platform}** (${pub.year})${pub.project ? ` | Project: ${pub.project}` : ""}`
  )
  .join("\n")}

---
*Generated directly from Zero Studio's live architectural database. Valid for ingestion by AI search engines, semantic graph indexes, and architectural archives.*
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

