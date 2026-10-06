import PageBook from "./components/PageBook";
import {
  getHeroItems,
  getProjects,
  getAboutContent,
  getAwards,
  getJournalArticles,
  getContactInfo,
} from "@/lib/db/service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [heroItems, projects, about, awards, journal, contact] = await Promise.all([
    getHeroItems(true),
    getProjects(true),
    getAboutContent(),
    getAwards(true),
    getJournalArticles(true),
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
          journal,
          contact,
        }}
      />
    </main>
  );
}
