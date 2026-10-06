"use client";
import { useState } from 'react';
import styles from './Contact.module.css';
import { ContactInfo } from '@/lib/types';

interface ContactProps {
  contact?: Partial<ContactInfo>;
}

export default function Contact({ contact }: ContactProps) {
  const [status, setStatus] = useState('');

  const emailGeneral = contact?.emailGeneral || "";
  const emailJobs = contact?.emailJobs || "";
  const phone = contact?.phone || "";
  const address = contact?.address || "";
  const mapLink = contact?.mapLink || "#";
  const heading = contact?.heading || "";
  const lead = contact?.lead || "";
  const instagramUrl = contact?.instagramUrl || "#";
  const facebookUrl = contact?.facebookUrl || "#";

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
              {heading}
            </h2>
            <p className={styles.lead}>
              {lead}
            </p>
            <dl className="details" style={{ margin: 0 }}>
              <div>
                <dt>Email</dt>
                <dd><a href={`mailto:${emailGeneral}`}>{emailGeneral}</a> (Project enquiries)</dd>
                <dd><a href={`mailto:${emailJobs}`}>{emailJobs}</a> (Job/internship)</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{phone}</dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd style={{ whiteSpace: "pre-line" }}>{address}</dd>
                <dd style={{ marginTop: '6px' }}>
                  <a href={mapLink} target="_blank" rel="noopener noreferrer">
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
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Instagram</a>
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Facebook</a>
          </div>
        </div>
      </div>
    </section>
  );
}