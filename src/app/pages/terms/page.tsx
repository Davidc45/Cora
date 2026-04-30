import '@/app/styles/privacy.css';

export default function TermsPage() {
  const effectiveDate = 'April 30, 2026';
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'corafyi@gmail.com';

  return (
    <div className="privacy-page">
      <div className="privacy-shell">
        <header className="privacy-header">
          <p className="privacy-kicker">Cora Student Project</p>
          <h1>Terms of Use</h1>
          <p className="privacy-meta">
            <strong>Effective date:</strong> {effectiveDate}
          </p>
          <p className="privacy-intro">
            These Terms govern your use of the Cora platform and related services. By using Cora,
            you agree to these Terms.
          </p>
        </header>

        <main className="privacy-content">
          <section className="privacy-section">
            <h2>1. About This Service</h2>
            <p>
              Cora is a student-led project for community safety reporting and awareness. It is
              provided for informational and educational purposes.
            </p>
          </section>

          <section className="privacy-section">
            <h2>2. Eligibility and Accounts</h2>
            <ul>
              <li>You are responsible for maintaining the security of your account.</li>
              <li>You must provide accurate information when registering.</li>
              <li>You are responsible for activity under your account.</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>3. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Post unlawful, abusive, threatening, or misleading content.</li>
              <li>Impersonate another person or misrepresent report details intentionally.</li>
              <li>Attempt to disrupt, overload, or compromise the platform.</li>
              <li>Upload malicious code or engage in automated abuse.</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>4. User Content</h2>
            <p>
              You retain ownership of content you submit. By submitting content, you grant us a
              non-exclusive, worldwide, royalty-free license to host, display, process, and use
              that content to operate and improve the service.
            </p>
          </section>

          <section className="privacy-section">
            <h2>5. Moderation and Enforcement</h2>
            <p>
              We may review, remove, or restrict content or accounts that violate these Terms,
              applicable law, or community safety standards.
            </p>
          </section>

          <section className="privacy-section">
            <h2>6. No Emergency or Professional Service</h2>
            <p>
              Cora is not an emergency service and does not replace 911, law enforcement, legal,
              medical, or professional advice. In emergencies, contact the appropriate emergency
              services immediately.
            </p>
          </section>

          <section className="privacy-section">
            <h2>7. Disclaimers</h2>
            <p>
              The service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of
              any kind, to the fullest extent permitted by law.
            </p>
          </section>

          <section className="privacy-section">
            <h2>8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, we are not liable for indirect, incidental,
              special, consequential, or punitive damages arising from your use of the service.
            </p>
          </section>

          <section className="privacy-section">
            <h2>9. Changes to the Service or Terms</h2>
            <p>
              We may modify the service or these Terms from time to time. Continued use after
              updates means you accept the revised Terms.
            </p>
          </section>

          <section className="privacy-section">
            <h2>10. Contact</h2>
            <p>
              Questions about these Terms can be sent to{' '}
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
