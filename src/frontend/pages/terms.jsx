import { Telescope } from "lucide-react";

const styles = {
  page: {
    background: "#ffffff",
    color: "#15140f",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    maxWidth: "720px",
    margin: "0 auto",
    padding: "64px 24px 96px",
    lineHeight: 1.6,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px",
  },
  logoText: {
    fontWeight: 700,
    fontSize: "1.1rem",
  },
  updated: {
    color: "#6c6a62",
    fontSize: "0.9rem",
    marginBottom: "40px",
  },
  h1: {
    fontSize: "2rem",
    fontWeight: 700,
    margin: "0 0 8px",
  },
  banner: {
    border: "1px solid #e2531c",
    background: "#fdf1ec",
    color: "#8a350f",
    borderRadius: "10px",
    padding: "16px 20px",
    fontSize: "0.95rem",
    margin: "0 0 40px",
  },
  h2: {
    fontSize: "1.2rem",
    fontWeight: 700,
    margin: "40px 0 12px",
  },
  p: {
    fontSize: "0.98rem",
    color: "#2b2a25",
    margin: "0 0 14px",
  },
  ul: {
    paddingLeft: "20px",
    margin: "0 0 14px",
  },
  li: {
    fontSize: "0.98rem",
    color: "#2b2a25",
    marginBottom: "8px",
  },
  footerNote: {
    marginTop: "56px",
    paddingTop: "24px",
    borderTop: "1px solid #e6e3dc",
    color: "#6c6a62",
    fontSize: "0.85rem",
  },
};

export function Terms() {
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Telescope size={22} strokeWidth={1.8} color="#e2531c" />
        <span style={styles.logoText}>Lunaar</span>
      </div>
      <p style={styles.updated}>Last updated: {new Date().toLocaleDateString()}</p>

      <h1 style={styles.h1}>Terms and Conditions</h1>

      <div style={styles.banner}>
        Lunaar is currently in beta. Features may change, break, or be removed without notice,
        and courses, lessons, or progress data may be reset or lost as we continue building the
        product. Use it with that in mind.
      </div>

      <h2 style={styles.h2}>1. Agreement to these terms</h2>
      <p style={styles.p}>
        By creating a Lunaar account, you agree to these Terms and Conditions in full. If you do
        not agree with any part of these terms, do not create an account or use the service.
      </p>

      <h2 style={styles.h2}>2. Changes to these terms</h2>
      <p style={styles.p}>
        We may update, modify, or replace any part of these terms at any time, at our sole
        discretion. Continued use of Lunaar after a change is posted means you accept the revised
        terms. It is your responsibility to check this page periodically for updates.
      </p>

      <h2 style={styles.h2}>3. Beta status</h2>
      <p style={styles.p}>
        Lunaar is under active development and is not a finished product. We do not guarantee
        uptime, accuracy of AI-generated course content, data persistence, or that any given
        feature will continue to exist in its current form. The service is provided on an
        as-is, as-available basis during this beta period.
      </p>

      <h2 style={styles.h2}>4. Your account</h2>
      <ul style={styles.ul}>
        <li style={styles.li}>You're responsible for keeping your login credentials secure.</li>
        <li style={styles.li}>You're responsible for activity that happens under your account.</li>
        <li style={styles.li}>You must provide accurate information when creating an account.</li>
      </ul>

      <h2 style={styles.h2}>5. Acceptable use</h2>
      <p style={styles.p}>
        You agree not to misuse Lunaar — including attempting to disrupt the service, accessing
        another user's account without permission, or using the platform to generate or
        distribute unlawful, harmful, or abusive content.
      </p>

      <h2 style={styles.h2}>6. Course content</h2>
      <p style={styles.p}>
        Lessons and courses on Lunaar are generated with AI based on your prompts. Content may
        contain errors or inaccuracies. Don't treat generated content as professional, medical,
        legal, or financial advice.
      </p>

      <h2 style={styles.h2}>7. Termination</h2>
      <p style={styles.p}>
        We may suspend or terminate your account at any time, particularly during this beta
        period, if we discontinue a feature, discontinue the service, or believe these terms have
        been violated.
      </p>

      <h2 style={styles.h2}>8. Limitation of liability</h2>
      <p style={styles.p}>
        To the fullest extent permitted by law, Lunaar and its creators are not liable for any
        indirect, incidental, or consequential damages arising from your use of the service,
        including loss of data or progress during the beta period.
      </p>

      <h2 style={styles.h2}>9. Contact</h2>
      <p style={styles.p}>Questions about these terms can be sent to [your contact email].</p>

      <div style={styles.footerNote}>
        This is a general template and not legal advice. Have a lawyer review it before relying
        on it for a live product.
      </div>
    </div>
  );
}