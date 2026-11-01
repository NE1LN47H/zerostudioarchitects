import type { Metadata } from "next";
import PageBook from "./components/PageBook";
import {
  getHeroItems,
  getProjects,
  getAboutContent,
  getAwards,
  getPublications,
  getTeamMembers,
  getContactInfo,
} from "@/services";
import { constructMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = constructMetadata({
  path: "/",
});

export default async function Home() {
  const [heroItems, projects, about, awards, publications, team, contact] = await Promise.all([
    getHeroItems(true),
    getProjects(true),
    getAboutContent(),
    getAwards(true),
    getPublications(true),
    getTeamMembers(true),
    getContactInfo(),
  ]);

  return (
    <main id="main">
      <PageBook
        initialData={{
          heroItems,
          projects,
          about,
          awards,
          publications,
          team,
          contact,
        }}
      />
    </main>
  );
}
