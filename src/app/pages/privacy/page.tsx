import '@/app/styles/privacy.css';

export default function PrivacyPage() {
  const effectiveDate = 'April 30, 2026';
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'corafyi@gmail.com';

  return (
    <div className="privacy-page">
      <div className="privacy-shell">
        <header className="privacy-header">
          <p className="privacy-kicker">Cora Student Project</p>
          <h1>Privacy Policy</h1>
          <p className="privacy-meta">
            <strong>Effective date:</strong> {effectiveDate}
          </p>
          <p className="privacy-intro">
            This policy explains what information Cora collects, how it is used, and your choices.
            It applies to the Cora website, features, and related services for this student-led
            project.
          </p>
        </header>

        <main className="privacy-content">
          <section className="privacy-section">
            <h2>1. Information We Collect</h2>
            <p>We may collect the following categories of information:</p>
            <ul>
              <li>
                <strong>Account information:</strong> email address, username, encrypted
                authentication data, and optional profile photo.
              </li>
              <li>
                <strong>User content:</strong> reports, comments, votes, and other information you
                submit in the app.
              </li>
              <li>
                <strong>Location-related data:</strong> location details you provide when creating
                reports (for example, address or map pin).
              </li>
              <li>
                <strong>Device and technical data:</strong> browser type, IP address, app usage
                logs, and basic diagnostics used for security and reliability.
              </li>
              <li>
                <strong>Notification data:</strong> push notification subscription tokens and phone
                verification status.
              </li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>2. How We Use Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide and maintain the platform.</li>
              <li>Authenticate users and secure accounts.</li>
              <li>Display community reports, comments, and related content.</li>
              <li>Send transactional messages such as verification and security notifications.</li>
              <li>Improve product quality, performance, and abuse prevention.</li>
              <li>Comply with legal obligations and enforce platform rules.</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>3. How We Share Information</h2>
            <p>We do not sell personal information. We may share information with:</p>
            <ul>
              <li>
                <strong>Service providers</strong> that help us operate the app (for example
                hosting, storage, authentication, messaging, analytics).
              </li>
              <li>
                <strong>Other users</strong> when you post content intended for community
                visibility.
              </li>
              <li>
                <strong>Authorities or legal recipients</strong> where required by law, legal
                process, or to protect rights, safety, and platform integrity.
              </li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>4. Data Retention</h2>
            <p>
              We retain information for as long as needed to provide the service, comply with legal
              obligations, resolve disputes, and enforce agreements. Retention periods may vary by
              data type and legal requirement.
            </p>
          </section>

          <section className="privacy-section">
            <h2>5. Security</h2>
            <p>
              We use reasonable technical and organizational safeguards to protect data. No method
              of transmission or storage is 100% secure, so we cannot guarantee absolute security.
            </p>
          </section>

          <section className="privacy-section">
            <h2>6. Your Choices and Rights</h2>
            <p>Depending on your jurisdiction, you may have rights to:</p>
            <ul>
              <li>Access, correct, or delete certain personal information.</li>
              <li>Object to or restrict certain processing.</li>
              <li>Request a copy of your data.</li>
              <li>Withdraw consent where processing is based on consent.</li>
            </ul>
            <p>
              To make a request, contact us at{' '}
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
            </p>
          </section>

          <section className="privacy-section">
            <h2>7. Children&apos;s Privacy</h2>
            <p>
              Our service is not directed to children under 13, and we do not knowingly collect
              personal information from children under 13.
            </p>
          </section>

          <section className="privacy-section">
            <h2>8. Third-Party Services</h2>
            <p>
              The platform may use third-party services and links. Their privacy practices are
              governed by their own policies.
            </p>
          </section>

          <section className="privacy-section">
            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will post the revised version
              on this page and update the effective date.
            </p>
          </section>

          <section className="privacy-section">
            <h2>10. Contact</h2>
            <p>
              If you have questions about this Privacy Policy, contact us at{' '}
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
