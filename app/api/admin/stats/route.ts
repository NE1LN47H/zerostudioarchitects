import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth";
import {
  getProjects,
  getHeroItems,
  getAwards,
  getPublications,
  getTeamMembers,
  getMediaItems,
} from "@/services";

export async function GET(req: NextRequest) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const [projects, hero, awards, publications, team, media] = await Promise.all([
      getProjects(),
      getHeroItems(),
      getAwards(),
      getPublications(),
      getTeamMembers(),
      getMediaItems(),
    ]);

    return NextResponse.json({
      counts: {
        projects: projects.length,
        hero: hero.length,
        awards: awards.length,
        publications: publications.length,
        team: team.length,
        media: media.length,
      },
      visibility: {
        projectsVisible: projects.filter((p) => p.visible).length,
        projectsHidden: projects.filter((p) => !p.visible).length,
        heroVisible: hero.filter((h) => h.visible).length,
        heroHidden: hero.filter((h) => !h.visible).length,
      },
      recentProjects: projects.slice(0, 4),
      recentPublications: publications.slice(0, 4),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
