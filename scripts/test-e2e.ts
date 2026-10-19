import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { getDb } from "../lib/mongodb";
import { getProjects, getProjectBySlug, getHeroItems, getAboutContent, getAwards, getJournalArticles } from "../lib/db/service";

const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("==================================================");
  console.log("🧪 EXECUTING FULL WORKFLOW TESTS AGAINST ATLAS");
  console.log("==================================================\n");

  // TEST A — DATABASE
  console.log("▶ TEST A — DATABASE");
  const db = await getDb();
  console.log(`Connected to database "${db.databaseName}" on MongoDB Atlas`);
  const collections = await db.listCollections().toArray();
  console.log(`Collections found: ${collections.map(c => c.name).join(", ")}`);
  console.log("✅ TEST A PASSED: Atlas database connection active.\n");

  // TEST B — MIGRATION
  console.log("▶ TEST B — MIGRATION RECORD VERIFICATION");
  const counts = {
    hero: await db.collection("hero").countDocuments(),
    projects: await db.collection("projects").countDocuments(),
    awards: await db.collection("awards").countDocuments(),
    journal: await db.collection("journal").countDocuments(),
    team: await db.collection("team").countDocuments(),
    about: await db.collection("about").countDocuments(),
    contact: await db.collection("contact").countDocuments(),
    siteSettings: await db.collection("siteSettings").countDocuments(),
  };
  console.log("Counts in MongoDB Atlas:", counts);
  if (counts.projects < 6 || counts.hero < 18 || counts.awards < 23 || counts.journal < 6) {
    throw new Error("TEST B FAILED: Record counts in Atlas lower than expected");
  }
  console.log("✅ TEST B PASSED: All expected migrated records are present in Atlas.\n");

  // TEST C — CMS AUTH & FETCHING
  console.log("▶ TEST C — CMS FETCHING VIA ADMIN API");
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.ADMIN_EMAIL || "admin@zerostudio.org",
      password: process.env.ADMIN_PASSWORD || "admin123456",
    }),
  });
  if (!loginRes.ok) throw new Error(`Login failed with status ${loginRes.status}`);
  const cookie = loginRes.headers.get("set-cookie") || "";
  const authHeaders = { Cookie: cookie };

  const adminProjectsRes = await fetch(`${BASE_URL}/api/admin/projects`, { headers: authHeaders });
  const adminProjectsData = await adminProjectsRes.json();
  console.log(`CMS fetched ${adminProjectsData.projects?.length} projects from MongoDB Atlas`);
  if (!adminProjectsData.projects || adminProjectsData.projects.length !== 6) {
    throw new Error("TEST C FAILED: CMS could not fetch projects from Atlas");
  }
  console.log("✅ TEST C PASSED: Admin CMS successfully fetches live data from Atlas.\n");

  // TEST D — PUBLIC FETCHING
  console.log("▶ TEST D — PUBLIC PAGES FETCHING FROM ATLAS");
  const homeRes = await fetch(`${BASE_URL}/`);
  if (!homeRes.ok) throw new Error("Homepage fetch failed");
  const homeHtml = await homeRes.text();
  if (!homeHtml.includes("HAVEN") || !homeHtml.includes("ZERO STUDIO")) {
    throw new Error("Homepage does not contain dynamic MongoDB project data");
  }

  const projectsRes = await fetch(`${BASE_URL}/projects`);
  const projectsHtml = await projectsRes.text();
  if (!projectsHtml.includes("HAVEN") || !projectsHtml.toLowerCase().includes("residence at edavanna")) {
    throw new Error("Projects listing does not contain dynamic Atlas project data");
  }

  const awardsRes = await fetch(`${BASE_URL}/awards`);
  const awardsHtml = await awardsRes.text();
  if (!awardsHtml.includes("Awards") || !awardsHtml.includes("Recognitions")) {
    throw new Error("Awards page render failed");
  }

  const mediaRes = await fetch(`${BASE_URL}/media`);
  const mediaHtml = await mediaRes.text();
  if (!mediaHtml.includes("Media") && !mediaHtml.includes("Zero Studio")) {
    throw new Error("Media page render failed");
  }

  const articleRes = await fetch(`${BASE_URL}/journal/the-architecture-of-quiet-spaces`);
  const articleHtml = await articleRes.text();
  if (!articleHtml.includes("The Architecture of Quiet Spaces")) {
    throw new Error("Journal slug page render failed");
  }
  console.log("✅ TEST D PASSED: Public pages render live data from MongoDB Atlas.\n");

  // TEST E — PROJECT EDIT
  console.log("▶ TEST E — PROJECT EDIT VIA CMS");
  const testEditRes = await fetch(`${BASE_URL}/api/admin/projects/HAVEN`, {
    method: "PUT",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ title: "HAVEN EDITORIAL PROOF" }),
  });
  if (!testEditRes.ok) throw new Error("CMS Project edit failed");
  
  // Verify public reflection
  const havenPublicRes = await fetch(`${BASE_URL}/projects/HAVEN`);
  const havenPublicHtml = await havenPublicRes.text();
  if (!havenPublicHtml.includes("HAVEN EDITORIAL PROOF")) {
    throw new Error("TEST E FAILED: Public project detail did not reflect CMS edit");
  }
  // Restore
  await fetch(`${BASE_URL}/api/admin/projects/HAVEN`, {
    method: "PUT",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ title: "HAVEN" }),
  });
  console.log("✅ TEST E PASSED: Project title edited in CMS and verified on public page.\n");

  // TEST F — PROJECT CREATE
  console.log("▶ TEST F — PROJECT CREATE VIA CMS");
  const createRes = await fetch(`${BASE_URL}/api/admin/projects`, {
    method: "POST",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "ATLAS PAVILION",
      slug: "ATLAS_PAVILION",
      subtitle: "A dynamic proof pavilion",
      category: "Pavilion",
      year: "2026",
      location: "Kozhikode",
      area: "1,200 sqft",
      leadArchitects: "Hafeez & Arjun",
      heroImage: "/projects/HAVEN/1-opt.jpg",
      visible: true,
      order: 99,
    }),
  });
  if (!createRes.ok) throw new Error("CMS Project creation failed");
  const publicListCheck = await fetch(`${BASE_URL}/projects`);
  const publicListHtml = await publicListCheck.text();
  if (!publicListHtml.includes("ATLAS PAVILION")) {
    throw new Error("TEST F FAILED: Newly created project not found on public projects page");
  }
  console.log("✅ TEST F PASSED: New project created in CMS and rendered on public listing.\n");

  // TEST G — PROJECT DELETE
  console.log("▶ TEST G — PROJECT DELETE VIA CMS");
  const deleteRes = await fetch(`${BASE_URL}/api/admin/projects/ATLAS_PAVILION`, {
    method: "DELETE",
    headers: authHeaders,
  });
  if (!deleteRes.ok) throw new Error("CMS Project deletion failed");
  const publicListAfterDelete = await fetch(`${BASE_URL}/projects`);
  const htmlAfterDelete = await publicListAfterDelete.text();
  if (htmlAfterDelete.includes("ATLAS PAVILION")) {
    throw new Error("TEST G FAILED: Deleted project still appears on public listing");
  }
  console.log("✅ TEST G PASSED: Project deleted in CMS and removed from public listing.\n");

  // TEST H — ORDERING
  console.log("▶ TEST H — REORDERING");
  const currentProjs = await getProjects();
  const slugs = currentProjs.map(p => p.slug);
  const reorderRes = await fetch(`${BASE_URL}/api/admin/projects/reorder`, {
    method: "PUT",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ orderedSlugs: [...slugs].reverse() }),
  });
  if (!reorderRes.ok) throw new Error("Reorder failed");
  const reversed = await getProjects();
  if (reversed[0].slug !== slugs[slugs.length - 1]) {
    throw new Error("TEST H FAILED: Reorder did not persist");
  }
  // Restore order
  await fetch(`${BASE_URL}/api/admin/projects/reorder`, {
    method: "PUT",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ orderedSlugs: slugs }),
  });
  console.log("✅ TEST H PASSED: Project reordering persisted and verified.\n");

  // TEST I — HERO ITEM
  console.log("▶ TEST I — HERO MANAGEMENT");
  const targetHero = await db.collection("hero").findOne({});
  if (!targetHero) throw new Error("No hero item found in collection");
  const targetId = targetHero.id || targetHero._id.toString();
  const heroUpdateRes = await fetch(`${BASE_URL}/api/admin/hero/${targetId}`, {
    method: "PUT",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ title: "HAVEN — HERO PROOF" }),
  });
  if (!heroUpdateRes.ok) throw new Error("Hero update failed");
  const checked = await db.collection("hero").findOne({ $or: [{ id: targetId }, { _id: targetHero._id }] });
  if (checked?.title !== "HAVEN — HERO PROOF") throw new Error("Hero update not persisted");
  // Restore
  await fetch(`${BASE_URL}/api/admin/hero/${targetId}`, {
    method: "PUT",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ title: targetHero.title }),
  });
  console.log("✅ TEST I PASSED: Hero item successfully edited and verified.\n");

  // TEST J — ABOUT
  console.log("▶ TEST J — ABOUT CONTENT");
  const originalAbout = await getAboutContent();
  const aboutUpdateRes = await fetch(`${BASE_URL}/api/admin/about`, {
    method: "PUT",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ heading: "About Zero Studio Updated in Atlas" }),
  });
  if (!aboutUpdateRes.ok) throw new Error("About update failed");
  const homeWithNewAbout = await fetch(`${BASE_URL}/`);
  const homeAboutHtml = await homeWithNewAbout.text();
  if (!homeAboutHtml.includes("About Zero Studio Updated in Atlas")) {
    throw new Error("TEST J FAILED: Public home did not reflect About update");
  }
  // Restore
  await fetch(`${BASE_URL}/api/admin/about`, {
    method: "PUT",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ heading: originalAbout.heading }),
  });
  console.log("✅ TEST J PASSED: About content edited in CMS and verified on public homepage.\n");

  // TEST K — AWARDS
  console.log("▶ TEST K — AWARDS CRUD");
  const awardsCreateRes = await fetch(`${BASE_URL}/api/admin/awards`, {
    method: "POST",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({
      number: "99",
      award: "Global Architecture Citation 2026",
      project: "HAVEN",
      organization: "IIA",
      category: "Residential",
      year: "2026",
      order: 99,
      curated: false,
      visible: true,
      type: "project",
    }),
  });
  const newAwardData = await awardsCreateRes.json();
  const awardId = newAwardData.award?.id;
  const awardsPageCheck = await fetch(`${BASE_URL}/awards`);
  const awardsPageHtml = await awardsPageCheck.text();
  if (!awardsPageHtml.includes("Global Architecture Citation 2026")) {
    throw new Error("TEST K FAILED: Award not rendered on public awards page");
  }
  // Delete award
  await fetch(`${BASE_URL}/api/admin/awards/${awardId}`, {
    method: "DELETE",
    headers: authHeaders,
  });
  console.log("✅ TEST K PASSED: Award created, verified on public page, and deleted.\n");

  // TEST L — JOURNAL
  console.log("▶ TEST L — JOURNAL CRUD");
  const journalCreateRes = await fetch(`${BASE_URL}/api/admin/journal`, {
    method: "POST",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Atlas Dynamic Testing Essay",
      slug: "atlas-dynamic-testing-essay",
      category: "Practice",
      date: "OCTOBER 2026",
      excerpt: "Verified end-to-end integration.",
      author: "Zero Studio",
      image: "/projects/HAVEN/1-opt.jpg",
      content: { intro: "Testing dynamic journal flow", paragraphs: ["Content"] },
      featured: false,
      visible: true,
      order: 99,
    }),
  });
  if (!journalCreateRes.ok) throw new Error("Journal create failed");
  const journalPageCheck = await fetch(`${BASE_URL}/journal/atlas-dynamic-testing-essay`);
  const journalPageHtml = await journalPageCheck.text();
  if (!journalPageHtml.includes("Atlas Dynamic Testing Essay")) {
    throw new Error("TEST L FAILED: Journal article not rendered on dynamic article page");
  }
  // Delete journal article
  await fetch(`${BASE_URL}/api/admin/journal/atlas-dynamic-testing-essay`, {
    method: "DELETE",
    headers: authHeaders,
  });
  console.log("✅ TEST L PASSED: Journal article created, verified on public page, and deleted.\n");

  // TEST M — CONTACT
  console.log("▶ TEST M — CONTACT EDIT");
  const contactUpdateRes = await fetch(`${BASE_URL}/api/admin/contact`, {
    method: "PUT",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ phone: "+91 99999 88888" }),
  });
  if (!contactUpdateRes.ok) throw new Error("Contact update failed");
  const homeContactCheck = await fetch(`${BASE_URL}/`);
  const homeContactHtml = await homeContactCheck.text();
  if (!homeContactHtml.includes("+91 99999 88888")) {
    throw new Error("TEST M FAILED: Updated phone not found on public website");
  }
  // Restore
  await fetch(`${BASE_URL}/api/admin/contact`, {
    method: "PUT",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ phone: "+91 80894 44555" }),
  });
  console.log("✅ TEST M PASSED: Contact updated and verified on public homepage.\n");

  // TEST N — PROJECT GALLERY & MONOGRAPH STRUCTURE
  console.log("▶ TEST N — PROJECT GALLERY & DETAIL MONOGRAPH");
  const haven = await getProjectBySlug("HAVEN");
  if (!haven) throw new Error("HAVEN project not found");
  if (haven.gallery.length === 0) throw new Error("Gallery images empty");
  
  const originalCaption = haven.gallery[0].caption;
  const updatedGallery = [...haven.gallery];
  updatedGallery[0] = { ...updatedGallery[0], caption: "TEST GALLERY CAPTION PROOF" };
  
  await fetch(`${BASE_URL}/api/admin/projects/HAVEN`, {
    method: "PUT",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ gallery: updatedGallery }),
  });
  
  const havenDetailHtml = await (await fetch(`${BASE_URL}/projects/HAVEN`)).text();
  if (!havenDetailHtml.includes("TEST GALLERY CAPTION PROOF")) {
    throw new Error("TEST N FAILED: Gallery caption update not reflected on detail page");
  }
  // Restore
  updatedGallery[0] = { ...updatedGallery[0], caption: originalCaption };
  await fetch(`${BASE_URL}/api/admin/projects/HAVEN`, {
    method: "PUT",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ gallery: updatedGallery }),
  });
  console.log("✅ TEST N PASSED: Project gallery update verified on monograph page.\n");

  // TEST O — ALL 6 PROJECT SLUGS DYNAMIC RENDERING
  console.log("▶ TEST O — VERIFY ALL PROJECT SLUG PAGES");
  const allProjects = await getProjects(true);
  for (const p of allProjects) {
    const slugRes = await fetch(`${BASE_URL}/projects/${p.slug}`);
    if (!slugRes.ok) throw new Error(`Project page for ${p.slug} returned ${slugRes.status}`);
    const slugHtml = await slugRes.text();
    if (!slugHtml.includes(p.title)) {
      throw new Error(`Project page for ${p.slug} did not contain title ${p.title}`);
    }
    console.log(`  ✓ /projects/${p.slug} rendered 200 OK with title: "${p.title}"`);
  }
  console.log("✅ TEST O PASSED: All 6 dynamic project pages render successfully from Atlas.\n");

  // TEST P — CMS CLOUDINARY IMAGE UPLOAD & MEDIA DELETE
  console.log("▶ TEST P — CMS CLOUDINARY IMAGE UPLOAD & MEDIA DELETE");
  const uploadPayload = {
    dataUri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR42mNk+M9QzwAEjAwMDAwAFAAC/674iZcAAAAASUVORK5CYII=",
    folder: "zerostudio/e2e_test",
    filename: "e2e_test_sample.png",
  };
  const uploadRes = await fetch(`${BASE_URL}/api/admin/upload`, {
    method: "POST",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify(uploadPayload),
  });
  if (!uploadRes.ok) throw new Error(`Upload failed with status ${uploadRes.status}`);
  const uploadData = await uploadRes.json();
  if (!uploadData.success || !uploadData.asset?.url?.includes("res.cloudinary.com/hle2zpto")) {
    throw new Error("TEST P FAILED: Upload did not return Cloudinary URL with hle2zpto");
  }
  console.log(`  ✓ Image uploaded to Cloudinary: ${uploadData.asset.url}`);

  // Delete uploaded media item
  const deleteMediaRes = await fetch(`${BASE_URL}/api/admin/media/${uploadData.asset.mediaId}`, {
    method: "DELETE",
    headers: authHeaders,
  });
  if (!deleteMediaRes.ok) throw new Error("Delete media failed");
  console.log("  ✓ Uploaded media item successfully deleted from Cloudinary & Atlas");
  console.log("✅ TEST P PASSED: CMS Cloudinary upload and delete operations verified.\n");

  console.log("==================================================");
  console.log("🎉 ALL TESTS A THROUGH P COMPLETED & PASSED!");
  console.log("==================================================");
}

runTests().then(() => process.exit(0)).catch(err => {
  console.error("❌ Test suite failed:", err);
  process.exit(1);
});
