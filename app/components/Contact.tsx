"use client";
import { useState } from 'react';

export default function Contact() {
  const [status, setStatus] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const form = e.target;
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const message = form.elements.message.value.trim();

    if (!name || !message) {
      setStatus('Please fill in your name and project details.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('Please enter a valid email.');
      form.elements.email.focus();
      return;
    }
    setStatus('Thank you. We will reply within two working days.');
    form.reset();
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 0,
        position: 'relative',
        backgroundColor: 'var(--bg, #ffffff)',
      }}
    >
      <div className="wrap" style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 40px', width: '100%' }}>
        <div
          className="contact-panel glass glass-panel"
          style={{
            maxWidth: '1080px',
            margin: '0 auto',
            padding: '32px 36px',
          }}
        >
          <div>
            <h2
              id="contact-title"
              style={{
                fontFamily: "var(--serif, 'Instrument Serif', Georgia, serif)",
                fontSize: 'clamp(2rem, 3.2vw, 2.75rem)',
                fontWeight: 400,
                margin: '0 0 6px 0',
                lineHeight: 1,
              }}
            >
              Start a project
            </h2>
            <p className="lead" style={{ margin: '0 0 20px 0', fontSize: '0.9375rem', color: '#666666' }}>
              We&apos;d love to hear about your project.
            </p>
            <dl className="details" style={{ margin: 0 }}>
              <div>
                <dt>Email</dt>
                <dd><a href="mailto:mail@zerostudio.org">mail@zerostudio.org</a> (Project enquiries)</dd>
                <dd><a href="mailto:jobs@zerostudio.org">jobs@zerostudio.org</a> (Job/internship)</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>+91 9447751826 · +91 8129355855</dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>#1/3793, East hill Road, Chakkorathukulam,<br />Eranhippalam P.O, Nadakkave, Kozhikode, Kerala 673006</dd>
                <dd style={{ marginTop: '6px' }}>
                  <a href="https://maps.app.goo.gl/poxkV6PNkGL9cJsSA" target="_blank" rel="noopener noreferrer">
                    View Location on Map →
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
              <textarea id="message" name="message" rows={3} placeholder="Tell us about the site, the brief and your timeline." required></textarea>
            </div>
            <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>Send message</button>
            <p className="status" id="status" role="status" aria-live="polite">{status}</p>
          </form>
        </div>

        {/* Minimal Footer Credits */}
        <div
          style={{
            maxWidth: '1080px',
            margin: '16px auto 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.6875rem',
            color: '#8c8c8c',
            letterSpacing: '0.04em',
          }}
        >
          <span>&copy; {new Date().getFullYear()} Zero Studio Architectures</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="https://www.instagram.com/zerostudioofficial" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Instagram</a>
            <a href="https://www.facebook.com/zerostudioofficial/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Facebook</a>
          </div>
        </div>
      </div>
    </section>
  );
}