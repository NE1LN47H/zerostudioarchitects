const fs = require('fs');
const path = require('path');
const componentsDir = path.join('app', 'components');
if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir);

const header = `"use client";
import { useState, useEffect } from 'react';

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="site-header">
      <div className="bar">
        <a className="logo" href="#top" aria-label="Zero Studio Architectures, home">
          Zero Studio
        </a>
        <nav id="primary-nav" aria-label="Primary">
          <ul className="nav-list nav-left">
            <li><a href="#projects" onClick={() => setOpen(false)}>Projects</a></li>
            <li><a href="#about" onClick={() => setOpen(false)}>About</a></li>
            <li><a href="#awards" onClick={() => setOpen(false)}>Awards</a></li>
          </ul>
          <ul className="nav-list nav-right">
            <li><a href="#journal" onClick={() => setOpen(false)}>Journal</a></li>
            <li><a href="#contact" onClick={() => setOpen(false)}>Contact</a></li>
          </ul>
        </nav>
        <button 
          className="menu-btn" 
          type="button" 
          aria-expanded={open} 
          aria-controls="primary-nav" 
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
            <path d="M4 8h16M4 16h16" />
          </svg>
        </button>
      </div>
      <style jsx global>{\`
        body.nav-open .site-header nav {
          display: block;
        }
      \`}</style>
    </header>
  );
}`;

const hero = `export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="ph-fill" aria-hidden="true"></div>
      <div className="hero-panel glass glass-panel">
        <h1 id="hero-title">Buildings shaped by their place</h1>
        <p>Zero Studio Architectures designs homes, cultural spaces and workplaces with clear plans and honest materials.</p>
        <div className="btn-row">
          <a className="btn btn-primary" href="#projects">View Projects</a>
          <a className="btn" href="#contact">Get in Touch</a>
        </div>
      </div>
    </section>
  );
}`;

const about = `export default function About() {
  return (
    <section className="section intro" id="about" aria-label="Introduction">
      <div className="wrap">
        <div className="section-head" style={{ marginBottom: '32px' }}>
          <h2 id="studio-title">The Studio</h2>
        </div>
        <div style={{ maxWidth: '48em', margin: '0 auto', color: 'var(--ink-2)', fontSize: '1.0625rem', display: 'flex', flexDirection: 'column', gap: '16px', lineHeight: '1.8' }}>
          <p>Zero studio is a creative design studio driving itself forward with a perception to experiment with architecture under the varying contexts of need and most importantly, the user. Zero is not looking forward to create a signature range of products; rather would attend to details and customization of design considering need as the prime factor and would indulge in rendering the space for the priorities of the user. The idea is to intervene through design, to connect the environment with the need and the user.</p>
          <p>The studio began its operations in back 2013, at the small town of Manjeri in Malappuram with a relatively young team of architects, led by principal architects, Ar.Hamid MM & Ar.Hafeef PK. The visionary duo led the team for almost a decade before their untimely demise in 2022. In such a small span of time, the duo has been instrumental in placing Zero Studio among the distinguished architecture practices in the country achieving many accolades in different areas of design discourse and practice; inspiring many young minds to take charge of their future and to set foot in to the profession. Their charismatic spirit has undoubtedly been the foundation of Zero Studio.</p>
          <p>As envisioned by their mentors, the team at Zero now led by Ar.Shabna & Ar.Nidhinraj KJ would love to experiment through their projects in the maximum possible way they can: trying to converse with nature, to know it and to hurt it less and while doing so, always attempting to add something on their own making the end product unique. The approach is thus adaptive to each project, attempting to achieve a balance between functionality, aesthetics, context, climate, material, cost & time-frame regardless of the nature of the project. The team would rather love to call their practice an art studio where uniqueness of design and its character essentially varies vibrantly like colors in a palette. They believe in creating a subtle blend of architecture with all its other counterparts without abiding by a certain ideology or philosophy since that would restrict them from free thinking and thus experimenting with architecture.</p>
        </div>
      </div>
    </section>
  );
}`;

const projects = `export default function Projects() {
  return (
    <section className="section" id="projects" aria-labelledby="projects-title" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head">
          <h2 id="projects-title">Selected projects</h2>
          <p>Homes, workplaces and public buildings.</p>
        </div>
        <div className="grid projects-grid">
          <article className="card">
            <a href="#">
              <div className="ph r-11" aria-hidden="true"></div>
              <h3>House on the Ridge</h3>
              <p className="meta">Residential, 2025</p>
            </a>
          </article>
          <article className="card">
            <a href="#">
              <div className="ph r-11" aria-hidden="true"></div>
              <h3>Harbour Library</h3>
              <p className="meta">Cultural, 2024</p>
            </a>
          </article>
          <article className="card">
            <a href="#">
              <div className="ph r-11" aria-hidden="true"></div>
              <h3>Courtyard Residence</h3>
              <p className="meta">Residential, 2024</p>
            </a>
          </article>
          <article className="card">
            <a href="#">
              <div className="ph r-11" aria-hidden="true"></div>
              <h3>Mill Street Offices</h3>
              <p className="meta">Workplace, 2023</p>
            </a>
          </article>
        </div>
        <div className="section-foot">
          <a className="btn" href="#">View all projects</a>
        </div>
      </div>
    </section>
  );
}`;

const approach = `export default function Approach() {
  return (
    <section className="section" id="approach" aria-labelledby="approach-title" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head">
          <h2 id="approach-title">Our approach</h2>
          <p>Three principles guide every drawing we make.</p>
        </div>
        <div className="principles">
          <div className="principle">
            <h3>Start with the site</h3>
            <p>We study light, climate and context before we draw a line.</p>
          </div>
          <div className="principle">
            <h3>Use fewer materials</h3>
            <p>A short list of honest materials, detailed well, ages better than a long one.</p>
          </div>
          <div className="principle">
            <h3>Build it with you</h3>
            <p>You see drawings, models and costs at every stage, so every decision is clear.</p>
          </div>
        </div>
      </div>
    </section>
  );
}`;

const awards = `export default function Awards() {
  const recognitions = [
    {
      project: "A Reminiscing Walk through Valiyangadi: history that is retained and revived, Malappuram, Kerala",
      awards: [
        "IIA-Royale State Awards for Excellence in Architecture 2013 - Golden Leaf Award",
        "IIA National Awards for Excellence in Architecture 2016-Shortlisted"
      ]
    },
    {
      project: "The Temple of Knowledge_ A Tribute to the father of Malayalam, Tirur,Kerala",
      awards: [
        "IIA- Kerala State Awards for Excellence in Architecture 2014- Commendation",
        "IIA National Awards for Excellence in Architecture 2016-Shortlisted-Architecture unbuilt"
      ]
    },
    {
      project: "Green Lattice - The Tower of Remembrance; Seethi Haji Memorial Cultural center, Malappuram, Kerala",
      awards: [
        "IIA- Kerala State Awards_ for Excellence in Architecture 2014- Shortlisted",
        "Foundation for Architectural & Environmental awareness- Best Unbuilt Design 2014",
        "Archi Design awards for Excellence in Architecture 2015 -Winner",
        "Artist in Concrete Asia 2015-16 -Shortlisted",
        "IIA National Awards for Excellence in Architecture 2015- Commendation for 'Architecture Un built'"
      ]
    },
    {
      project: "Residence for Mr.Biju Mathew, Perinthalmanna, Kerala",
      awards: [
        "Vanitha Veedu architecture awards 2017: Award for Best Renovated House: winner"
      ]
    },
    {
      project: "Mausam- The house of seasons",
      awards: [
        "Ace Architect-Ace Alpha Awards 2017: Winner - Residential-Affordable",
        "The Merit List 2018-19",
        "NDTV Design and Architecture Awards 2017 Nomination-Architecture Award-House"
      ]
    },
    {
      project: "Kadalas -The Sea view cafe, South Beach, Calicut, Kerala",
      awards: [
        "IIA National Awards For Excellence In Architecture 2018-Shortlisted-Interior(Non-Residential)",
        "Forbes India Design Awards 2019: 'Best Retail & Hospitality Interiors-Special Commendation",
        "The Merit List 2018-19",
        "IID Design Excellence Awards 2019(Winner Zone 1)- Leisure & Entertainment",
        "IID Design Excellence Awards 2019: Runner up(National) - Leisure & Entertainment",
        "IIA Kerala state Awards for Excellence In Architecture 2021- Commendation-Category Hospitality",
        "IIID Kerala regional chapter awards 2023 -runner up -category-leisure & entertainment"
      ]
    },
    {
      project: "Reviving the spirit of a place - Story of An Abandoned Laterite Quarry",
      awards: [
        "IIA National Awards for Excellence in Architecture 2020- shortlisted -Landscape design -Category B",
        "IIA Kerala state Awards for Excellence in Architecture 2021- Silver Leaf -Category: Responsible Architecture",
        "IIA Kerala state Awards for Excellence in Architecture 2021- Gold Leaf -Category: Landscape B",
        "Kohler Bold Design Awards 2022-Winner-Category: Landscape design"
      ]
    },
    {
      project: "Edavani : Redefining a Tribal Hamlet ,Attappady,Kerala",
      awards: [
        "IIA National Awards for Excellence In Architecture 2020- Winner -category:Architecture Unbuilt",
        "IIA Kerala state Awards for Excellence in Architecture 2021-shortlisted -Category: Architecture Unbuilt"
      ]
    },
    {
      project: "Screen: the LANTERN house,Tirur,Kerala",
      awards: [
        "IIID Kerala regional chapter awards 2023 -runner up -category-residential",
        "Vanitha Veedu Architectural Awards 2024-Silver- Category -residential",
        "IIA Kerala state Awards for Excellence in Architecture 2023-Commendation-Category: Residential interior"
      ]
    },
    {
      project: "HAVEN,Kannur,Kerala",
      awards: [
        "Vanitha Veedu Architectural Awards 2026-Silver- Category -residential interior"
      ]
    }
  ];

  const otherRecognitions = [
    "2016: i-GEN Design Forum-2016': Listing for the most promising top50 gen-next architects by 'Architect and Interiors India' magazine.",
    "2017: Vanitha Veedu Architecture Awards 2017: The award for the Best Young Architect",
    "2018: Selected among the '20 under 35' in the 8th edition of Design X Design Annual Exhibition 2018",
    "2018: The 'Startup of the year Award 2018 'by Saint-Gobain & Economic times -Smart Green Summit",
    "2023: ID Honours Award for 2023: category -Biophilic Design.",
    "2023: i-GEN Design Forum-2023: Listing for the most promising top50 gen-next architects by 'Architect and Interiors India' magazine.",
    "2024: IIA National award for the best Young architect from Kerala Chapter"
  ];

  return (
    <section className="section" id="awards" aria-labelledby="awards-title" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head">
          <h2 id="awards-title">Awards & Recognitions</h2>
          <p>ZERO STUDIO (Estd 2013)</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px', maxWidth: '800px', margin: '0 auto' }}>
          <div>
            {recognitions.map((rec, idx) => (
              <div key={idx} style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', lineHeight: '1.4' }}>{rec.project}</h3>
                <ul style={{ listStyle: 'disc', paddingLeft: '24px', color: 'var(--ink-2)' }}>
                  {rec.awards.map((award, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>{award}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: '32px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Other Recognitions</h3>
            <ul style={{ listStyle: 'disc', paddingLeft: '24px', color: 'var(--ink-2)' }}>
              {otherRecognitions.map((rec, i) => (
                <li key={i} style={{ marginBottom: '8px' }}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}`;

const journal = `export default function Journal() {
  return (
    <section className="section" id="journal" aria-labelledby="journal-title" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head">
          <h2 id="journal-title">Journal</h2>
          <p>Notes on process, materials and places we've worked.</p>
        </div>
        <div className="grid">
          <article className="card">
            <a href="#">
              <div className="ph r-32" aria-hidden="true"></div>
              <h3>Why we draw every plan by hand first</h3>
              <p className="meta">Process, 12 March 2026</p>
            </a>
          </article>
          <article className="card">
            <a href="#">
              <div className="ph r-32" aria-hidden="true"></div>
              <h3>Choosing timber over concrete</h3>
              <p className="meta">Materials, 20 January 2026</p>
            </a>
          </article>
          <article className="card">
            <a href="#">
              <div className="ph r-32" aria-hidden="true"></div>
              <h3>Notes from a site visit</h3>
              <p className="meta">Site, 4 November 2025</p>
            </a>
          </article>
        </div>
        <div className="section-foot">
          <a className="btn" href="#">Read the journal</a>
        </div>
      </div>
    </section>
  );
}`;

const contact = `"use client";
import { useState } from 'react';

export default function Contact() {
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const message = form.elements.message.value.trim();

    if (!name || !message) {
      setStatus('Please fill in your name and project details.');
      return;
    }
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      setStatus('Please enter a valid email.');
      form.elements.email.focus();
      return;
    }
    setStatus('Thank you. We will reply within two working days.');
    form.reset();
  };

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="ph-fill" aria-hidden="true"></div>
      <div className="wrap">
        <div className="contact-panel glass glass-panel">
          <div>
            <h2 id="contact-title">Start a project</h2>
            <p className="lead">We'd love to hear about your project.</p>
            <dl className="details">
              <div>
                <dt>Email</dt>
                <dd><a href="mailto:mail@zerostudio.org">mail@zerostudio.org</a> (Project enquiries)</dd>
                <dd><a href="mailto:jobs@zerostudio.org">jobs@zerostudio.org</a> (Job/internship)</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>+91 9447751826 (Project enquiries)</dd>
                <dd>+91 8129355855 (Appointments)</dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>#1/3793, East hill Road, Chakkorathukulam,<br/>Eranhippalam P.O, Nadakkave,<br/>Kozhikode, Kerala 673006</dd>
                <dd style={{ marginTop: '8px' }}>
                  <a href="https://maps.app.goo.gl/poxkV6PNkGL9cJsSA" target="_blank" rel="noopener noreferrer">
                    View Location on Map
                  </a>
                </dd>
              </div>
            </dl>
          </div>
          <form id="contact-form" noValidate onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Your Name</label>
              <input id="name" name="name" type="text" autoComplete="name" placeholder="e.g. Jane Doe" required />
            </div>
            <div>
              <label htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" autoComplete="email" placeholder="e.g. jane@domain.com" required />
            </div>
            <div>
              <label htmlFor="message">Project details</label>
              <textarea id="message" name="message" placeholder="Tell us about the site, the brief and your timeline." required></textarea>
            </div>
            <button className="btn btn-primary" type="submit">Send message</button>
            <p className="status" id="status" role="status" aria-live="polite">{status}</p>
          </form>
        </div>
      </div>
    </section>
  );
}`;

const footer = `export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot">
          <div className="left">
            <p className="brand">Zero Studio Architectures</p>
            <p>Eranhippalam P.O, Nadakkave, Kozhikode</p>
          </div>
          <nav aria-label="Footer">
            <ul>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#awards">Awards</a></li>
              <li><a href="#journal">Journal</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>
          <div className="right">
            <a href="mailto:mail@zerostudio.org">mail@zerostudio.org</a>
            <a href="https://www.instagram.com/zerostudioofficial" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.facebook.com/zerostudioofficial/" target="_blank" rel="noopener noreferrer">Facebook</a>
          </div>
        </div>
        <p className="legal">&copy; {new Date().getFullYear()} Zero Studio Architectures</p>
      </div>
    </footer>
  );
}`;

fs.writeFileSync(path.join(componentsDir, 'Header.tsx'), header);
fs.writeFileSync(path.join(componentsDir, 'Hero.tsx'), hero);
fs.writeFileSync(path.join(componentsDir, 'About.tsx'), about);
fs.writeFileSync(path.join(componentsDir, 'Projects.tsx'), projects);
fs.writeFileSync(path.join(componentsDir, 'Approach.tsx'), approach);
fs.writeFileSync(path.join(componentsDir, 'Awards.tsx'), awards);
fs.writeFileSync(path.join(componentsDir, 'Journal.tsx'), journal);
fs.writeFileSync(path.join(componentsDir, 'Contact.tsx'), contact);
fs.writeFileSync(path.join(componentsDir, 'Footer.tsx'), footer);
