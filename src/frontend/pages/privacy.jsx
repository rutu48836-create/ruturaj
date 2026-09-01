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
  table: {
    width: "100%",
    borderCollapse: "collapse",
    margin: "0 0 20px",
    fontSize: "0.92rem",
  },
  th: {
    textAlign: "left",
    borderBottom: "2px solid #15140f",
    padding: "8px 10px 8px 0",
  },
  td: {
    borderBottom: "1px solid #e6e3dc",
    padding: "10px 10px 10px 0",
    color: "#2b2a25",
  },
  footerNote: {
    marginTop: "56px",
    paddingTop: "24px",
    borderTop: "1px solid #e6e3dc",
    color: "#6c6a62",
    fontSize: "0.85rem",
  },
};

export function Privacy() {
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Telescope size={22} strokeWidth={1.8} color="#e2531c" />
        <span style={styles.logoText}>Lunaar</span>
      </div>
      <p style={styles.updated}>Last updated: {new Date().toLocaleDateString()}</p>

      <h1 style={styles.h1}>Privacy Policy</h1>

      <div style={styles.banner}>
        Lunaar is currently in beta. As we keep building the product, what data we collect and
        how we handle it may change — check back here for updates.
      </div>

      <h2 style={styles.h2}>1. What we collect</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Data</th>
            <th style={styles.th}>Why</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={styles.td}>Email address</td>
            <td style={styles.td}>Account creation, login, and account-related emails</td>
          </tr>
          <tr>
            <td style={styles.td}>Course prompts and generated lessons</td>
            <td style={styles.td}>To generate and display your courses</td>
          </tr>
          <tr>
            <td style={styles.td}>Progress and streak data</td>
            <td style={styles.td}>To save your place and track daily activity</td>
          </tr>
          <tr>
            <td style={styles.td}>Basic usage data</td>
            <td style={styles.td}>To understand what's working and fix what isn't</td>
          </tr>
        </tbody>
      </table>

      <h2 style={styles.h2}>2. How we store it</h2>
      <p style={styles.p}>
        Account data, course content, and progress are stored with Supabase. Emails sent from
        Lunaar (like account notifications) are delivered through Amazon SES. We don't sell your
        data to third parties.
      </p>

      <h2 style={styles.h2}>3. AI-generated content</h2>
      <p style={styles.p}>
        When you type a prompt to generate a course, that prompt is sent to a third-party AI
        provider to generate lesson content. Avoid including sensitive personal information in
        your prompts.
      </p>

      <h2 style={styles.h2}>4. Cookies and sessions</h2>
      <p style={styles.p}>
        We use cookies or local storage to keep you logged in and remember basic preferences like
        sidebar state. We don't use third-party advertising trackers.
      </p>

      <h2 style={styles.h2}>5. Your rights</h2>
      <ul style={styles.ul}>
        <li style={styles.li}>You can request a copy of the data we hold about you.</li>
        <li style={styles.li}>You can request that your account and associated data be deleted.</li>
        <li style={styles.li}>You can update your account information at any time.</li>
      </ul>

      <h2 style={styles.h2}>6. Data retention</h2>
      <p style={styles.p}>
        We keep your data for as long as your account is active. If you delete your account, we
        remove your personal data within a reasonable period, except where we're required to keep
        it for legal reasons.
      </p>

      <h2 style={styles.h2}>7. Changes to this policy</h2>
      <p style={styles.p}>
        We may update this policy as Lunaar changes, especially during the beta period. Material
        changes will be reflected by updating the date at the top of this page.
      </p>

      <h2 style={styles.h2}>8. Contact</h2>
      <p style={styles.p}>
        Questions about this policy or your data can be sent to [your contact email].
      </p>

      <div style={styles.footerNote}>
        This is a general template and not legal advice. Have a lawyer review it before relying
        on it for a live product.
      </div>
    </div>
  );
}