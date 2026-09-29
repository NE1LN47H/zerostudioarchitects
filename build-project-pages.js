const fs = require('fs');
const path = require('path');

const projects = [
  { id: 'HAVEN', file: 'haven.html', title: 'HAVEN' },
  { id: 'MAUSAM_THE_HOUSE_OF_SEASONS', file: 'mausam.html', title: 'Mausam - The House of Seasons' },
  { id: 'RESIDENCE_AT_EDAVANNA', file: 'edavanna.html', title: 'Residence at Edavanna' }
];

for (const p of projects) {
  let htmlContent = '';
  try {
    htmlContent = fs.readFileSync(p.file, 'utf8');
  } catch(e) {
    console.error('Could not read ' + p.file);
  }

  const pageComponent = `
export default function ProjectPage() {
  const htmlContent = ${JSON.stringify(htmlContent)};

  return (
    <main id="main">
      <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
        <section className="section intro" aria-label="Introduction">
          <div className="wrap">
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--serif)', marginBottom: '32px', textAlign: 'center' }}>
              ${p.title}
            </h1>
            <div 
              className="project-content" 
              dangerouslySetInnerHTML={{ __html: htmlContent }} 
              style={{ maxWidth: '48em', margin: '0 auto', color: 'var(--ink-2)', fontSize: '1.0625rem', lineHeight: '1.8' }}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
  `;

  const dir = path.join('app', 'projects', p.id);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'page.tsx'), pageComponent);
}

const cssPath = path.join('app', 'globals.css');
let css = fs.readFileSync(cssPath, 'utf8');
if (!css.includes('.project-content p')) {
  css += `\n
.project-content p {
  margin-bottom: 1.5rem;
}
.project-content h1, .project-content h2, .project-content h3 {
  font-family: var(--serif);
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 400;
}
.project-content h1 { font-size: 2.5rem; }
.project-content h2 { font-size: 2rem; }
.project-content h3 { font-size: 1.5rem; }
.project-content strong {
  font-weight: 600;
}
`;
  fs.writeFileSync(cssPath, css);
}
