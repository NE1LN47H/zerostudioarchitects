import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth";
import {
  getProjects,
  getHeroItems,
  getAwards,
  getJournalArticles,
  getTeamMembers,
  getMediaItems,
} from "@/lib/db/service";

export async function GET(req: NextRequest) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const [projects, hero, awards, journal, team, media] = await Promise.all([
      getProjects(),
      getHeroItems(),
      getAwards(),
      getJournalArticles(),
      getTeamMembers(),
      getMediaItems(),
    ]);

    return NextResponse.json({
      counts: {
        projects: projects.length,
        hero: hero.length,
        awards: awards.length,
        journal: journal.length,
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
      recentJournal: journal.slice(0, 4),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
