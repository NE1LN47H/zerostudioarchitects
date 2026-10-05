import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Projects — Zero Studio Architectures",
  description: "Selected architectural, residential, commercial and cultural projects by Zero Studio Architectures.",
};

const ALL_PROJECTS = [
  {
    title: "HAVEN",
    href: "/projects/HAVEN",
    image: "/projects/HAVEN/1-opt.jpg",
    category: "Architecture & Interiors",
    location: "Kannur, Kerala",
    year: "2025",
    area: "3263 sqft",
  },
  {
    title: "Mausam - The House of Seasons",
    href: "/projects/MAUSAM_THE_HOUSE_OF_SEASONS",
    image: "/projects/MAUSAM_THE_HOUSE_OF_SEASONS/1_15-opt.jpg",
    category: "Residential Architecture",
    location: "Kozhikode, Kerala",
    year: "2024",
    area: "4100 sqft",
  },
  {
    title: "Residence at Edavanna",
    href: "/projects/RESIDENCE_AT_EDAVANNA",
    image: "/projects/RESIDENCE_AT_EDAVANNA/Q14-opt.jpg",
    category: "Residential Architecture",
    location: "Edavanna, Kerala",
    year: "2024",
    area: "2850 sqft",
  },
  {
    title: "Screen: The Lantern House",
    href: "/projects/MAUSAM_THE_HOUSE_OF_SEASONS",
    image: "/projects/HAVEN/28-opt.jpg",
    category: "Residential · Award Winner",
    location: "Tirur, Kerala",
    year: "2023",
    area: "3500 sqft",
  },
  {
    title: "Kadalas - The Sea View Cafe",
    href: "/projects/HAVEN",
    image: "/projects/HAVEN/6-opt.jpg",
    category: "Hospitality & Leisure Interiors",
    location: "South Beach, Calicut",
    year: "2019",
    area: "1800 sqft",
  },
  {
    title: "Reviving The Spirit of A Place",
    href: "/projects/RESIDENCE_AT_EDAVANNA",
    image: "/projects/RESIDENCE_AT_EDAVANNA/Q16-opt.jpg",
    category: "Landscape Design · Gold Leaf Award",
    location: "Malappuram, Kerala",
    year: "2021",
    area: "12 Acres",
  },
];

export default function ProjectsPage() {
  return (
    <main id="main" style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg, #ffffff)' }}>
      <div className="wrap" style={{ maxWidth: '1440px', margin: '0 auto', padding: '48px 40px 100px' }}>
        <header style={{ marginBottom: '56px' }}>
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#767676', display: 'block', marginBottom: '12px' }}>
            Portfolio
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontFamily: 'var(--serif)', fontWeight: 400, margin: '0 0 16px 0', lineHeight: 1.1 }}>
            All Projects
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--ink-2, #555555)', maxWidth: '640px', margin: 0, lineHeight: 1.6 }}>
            Homes, cultural spaces, landscapes and hospitality projects designed with context, climate and honest materials.
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '40px 32px' }}>
          {ALL_PROJECTS.map((proj, idx) => (
            <article key={idx} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <Link href={proj.href} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 11', overflow: 'hidden', backgroundColor: '#f0f0f0', marginBottom: '18px' }}>
                  <Image
                    src={proj.image}
                    alt={proj.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 500, margin: 0, letterSpacing: '0.01em' }}>
                    {proj.title}
                  </h2>
                  <span style={{ fontSize: '0.8125rem', color: '#888888', letterSpacing: '0.08em' }}>
                    {proj.year}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#666666', margin: '0 0 4px 0', letterSpacing: '0.02em' }}>
                  {proj.category}
                </p>
                <p style={{ fontSize: '0.8125rem', color: '#999999', margin: 0 }}>
                  {proj.location} · {proj.area}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
