import { getSiteUrl } from "@/lib/seo/config";
import { getAboutContent, getProjects, getAwards } from "@/services";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = getSiteUrl();
  const [about, projects, awards] = await Promise.all([
    getAboutContent().catch(() => null),
    getProjects(true).catch(() => []),
    getAwards(true).catch(() => []),
  ]);

  const p1 =
    about?.paragraph1 ||
    "Zero studio is a creative design studio driving itself forward with a perception to experiment with architecture under the varying contexts of need and, most importantly, the user. Founded in 2013 by the visionary duo Ar.Hamid MM & Ar.Hafeef PK, the studio is now led by Ar.Shabna & Ar.Nidhinraj KJ.";

  const p2 =
    about?.paragraph2 ||
    "We approach every project as a unique opportunity to converse with nature, finding an adaptive balance between functionality, aesthetics, context, climate, and materials.";

  const curatedProjects = projects.slice(0, 10);
  const curatedAwards = awards.slice(0, 8);

  const content = `# Zero Studio Architects

> Zero Studio is an award-winning architectural and design practice based in Kozhikode (Calicut), Kerala, India. Founded in 2013, the studio is widely recognized as one of the best architecture firms in Kerala, specializing in climate-responsive residential, cultural, commercial, and landscape design rooted in material truth.

## Studio Overview
- **Practice Name**: Zero Studio Architects
- **Founding Year**: 2013
- **Founders**: Ar. Hamid MM & Ar. Hafeef PK
- **Principal Architects**: Ar. Shabna K & Ar. Nidhinraj KJ
- **Headquarters**: #1/3793, East hill Road, Chakkorathukulam, Eranhippalam P.O, Nadakkave, Kozhikode, Kerala 673006, India
- **Coordinates**: 11.2783° N, 75.7828° E
- **Website**: ${siteUrl}
- **Official Contact**: mail@zerostudio.org | +91 80894 44555

## Architectural Philosophy
${p1}

${p2}

## Core Specializations
- **Tropical Residential Architecture**: Context-driven private residences designed with passive cooling, natural ventilation, inner courtyards, and vernacular craftsmanship.
- **Commercial & Workplace Spaces**: Contemporary office spaces, corporate hubs, and creative workspaces blending exposed brick, concrete, steel, and timber.
- **Cultural & Public Buildings**: Community spaces, institutions, and hospitality projects engaging seamlessly with Kerala's lush topography and tropical climate.
- **Adaptive Reuse & Vernacular Craft**: Reimagining traditional Kerala architectural typologies with contemporary structural rigor.

## Selected Architectural Projects
${curatedProjects
  .map(
    (p) =>
      `- [${p.title}](${siteUrl}/projects/${p.slug}): ${p.subtitle || p.summary || "Architectural project in Kerala."} (${p.category || "Architecture"}, ${p.year})`
  )
  .join("\n")}

## Key Recognitions & Citations
${curatedAwards
  .map(
    (a) =>
      `- **${a.award}** (${a.year}): ${a.project ? `${a.project} — ` : ""}${a.organization || "National Citation"}${a.category ? ` [${a.category}]` : ""}`
  )
  .join("\n")}

## Official Links & Directory
- [All Architecture Projects](${siteUrl}/projects)
- [About Studio & Leadership](${siteUrl}/about)
- [Recognition & Awards Archive](${siteUrl}/awards)
- [In the Media & Features](${siteUrl}/media)
- [Full AI Dataset Archive](${siteUrl}/llms-full.txt)
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
