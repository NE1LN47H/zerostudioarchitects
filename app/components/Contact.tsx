"use client";
import { useState } from 'react';
import styles from './Contact.module.css';

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
    <section id="contact" aria-labelledby="contact-title" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.contactPanel}>
          <div>
            <h2 id="contact-title" className={styles.title}>
              Start a project
            </h2>
            <p className={styles.lead}>
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
        <div className={styles.footerCredits}>
          <span>&copy; {new Date().getFullYear()} Zero Studio Architectures</span>
          <div className={styles.socialLinks}>
            <a href="https://www.instagram.com/zerostudioofficial" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Instagram</a>
            <a href="https://www.facebook.com/zerostudioofficial/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Facebook</a>
          </div>
        </div>
      </div>
    </section>
  );
}