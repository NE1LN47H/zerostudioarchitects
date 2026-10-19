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

export const dynamic = "force-dynamic";

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
