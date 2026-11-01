"use client";
import { useState } from 'react';
import styles from './Contact.module.css';
import { ContactInfo } from '@/types';

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
  const heading = contact?.heading || "Reach Us";
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
          <div className={styles.infoCol}>
            <h2 id="contact-title" className={styles.title}>
              {heading}
            </h2>
            {lead && (
              <p className={styles.lead}>
                {lead}
              </p>
            )}
            <dl className={styles.detailsList}>
              <div className={styles.detailItem}>
                <dt className={styles.detailLabel}>Email</dt>
                <dd className={styles.detailVal}>
                  <a href={`mailto:${emailGeneral}`}>{emailGeneral}</a>{" "}
                  <span className={styles.detailSub}>(Project enquiries)</span>
                </dd>
                {emailJobs && (
                  <dd className={styles.detailVal}>
                    <a href={`mailto:${emailJobs}`}>{emailJobs}</a>{" "}
                    <span className={styles.detailSub}>(Job/internship)</span>
                  </dd>
                )}
              </div>
              {phone && (
                <div className={styles.detailItem}>
                  <dt className={styles.detailLabel}>Phone</dt>
                  <dd className={styles.detailVal}>{phone}</dd>
                </div>
              )}
              {address && (
                <div className={styles.detailItem}>
                  <dt className={styles.detailLabel}>Address</dt>
                  <dd className={styles.detailVal} style={{ whiteSpace: "pre-line" }}>{address}</dd>
                  {mapLink && mapLink !== "#" && (
                    <dd className={styles.mapLinkWrap}>
                      <a href={mapLink} target="_blank" rel="noopener noreferrer" className={styles.mapLink}>
                        View Location on Map →
                      </a>
                    </dd>
                  )}
                  {/* Instagram & Facebook Favicons */}
                  <dd className={styles.addressSocials}>
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialFavicon}
                      aria-label="Instagram"
                      title="Zero Studio on Instagram"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                      <span>Instagram</span>
                    </a>
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialFavicon}
                      aria-label="Facebook"
                      title="Zero Studio on Facebook"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                      <span>Facebook</span>
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <form id="contact-form" noValidate onSubmit={handleSubmit} className={styles.contactForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>Your Name</label>
              <input id="name" name="name" type="text" autoComplete="name" placeholder="e.g. Jane Doe" required className={styles.formInput} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>Email Address</label>
              <input id="email" name="email" type="email" autoComplete="email" placeholder="e.g. jane@domain.com" required className={styles.formInput} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.formLabel}>Project details</label>
              <textarea id="message" name="message" rows={3} placeholder="Tell us about the site, the brief and your timeline." required className={styles.formTextarea}></textarea>
            </div>
            <button className={styles.submitBtn} type="submit">Send message</button>
            {status && (
              <p className={styles.formStatus} role="status" aria-live="polite">{status}</p>
            )}
          </form>
        </div>

        {/* Minimal Footer Credits */}
        <div className={styles.footerCredits}>
          <span>&copy; {new Date().getFullYear()} Zero Studio</span>
          <div className={styles.socialLinks}>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Instagram</a>
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Facebook</a>
          </div>
        </div>
      </div>
    </section>
  );
}
