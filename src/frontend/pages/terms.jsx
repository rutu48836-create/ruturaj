import { Link } from "react-router-dom";
import { Bot } from "lucide-react";

const c = {
  bg: "#08080a",
  surface: "#111114",
  border: "rgba(255,255,255,0.08)",
  text: "#f4f4f5",
  muted: "#a1a1aa",
  accent: "#f7844f",
  accent2: "#ff5f7e",
};

const s = {
  page: {
    position: "fixed",
    inset: 0,
    overflowY: "auto",
    background: c.bg,
    color: c.text,
    fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
    lineHeight: 1.7,
    boxSizing: "border-box",
  },
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 6vw",
    background: "rgba(8,8,10,0.75)",
    backdropFilter: "blur(14px)",
    borderBottom: `1px solid ${c.border}`,
  },
  brand: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    color: c.text,
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "1.1rem",
    letterSpacing: "-0.02em",
  },
  brandMark: {
    width: 32,
    height: 32,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    color: "#fff",
    background: `linear-gradient(135deg, ${c.accent}, ${c.accent2})`,
  },
  backLink: {
    color: c.muted,
    textDecoration: "none",
    fontSize: "0.92rem",
  },
  hero: {
    maxWidth: 820,
    margin: "0 auto",
    padding: "72px 24px 40px",
    textAlign: "center",
  },
  eyebrow: {
    margin: 0,
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    fontSize: "0.78rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: c.accent,
  },
  title: {
    margin: "14px 0 0",
    fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: "-0.03em",
  },
  subtitle: {
    margin: "18px auto 0",
    maxWidth: 560,
    color: c.muted,
    fontSize: "1.05rem",
  },
  updated: {
    margin: "18px 0 0",
    color: c.muted,
    fontSize: "0.85rem",
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
  },
  content: {
    maxWidth: 820,
    margin: "0 auto",
    padding: "0 24px 40px",
  },
  section: {
    marginBottom: 16,
    padding: "28px clamp(20px, 4vw, 32px)",
    borderRadius: 20,
    background: c.surface,
    border: `1px solid ${c.border}`,
  },
  sectionTitle: {
    margin: "0 0 14px",
    display: "flex",
    alignItems: "center",
    gap: 14,
    fontSize: "1.2rem",
    fontWeight: 600,
    letterSpacing: "-0.01em",
  },
  sectionNumber: {
    flexShrink: 0,
    padding: "3px 10px",
    borderRadius: 8,
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    fontSize: "0.8rem",
    fontWeight: 500,
    color: c.accent,
    background: "rgba(247,132,79,0.1)",
    border: "1px solid rgba(247,132,79,0.25)",
  },
  text: {
    margin: "0 0 12px",
    color: c.muted,
    fontSize: "0.96rem",
  },
  highlight: {
    color: "#ffd2bd",
    fontWeight: 600,
  },
  footer: {
    padding: "28px 24px",
    textAlign: "center",
    borderTop: `1px solid ${c.border}`,
  },
  footerText: {
    margin: 0,
    color: c.muted,
    fontSize: "0.85rem",
  },
};

const sections = [
  {
    title: "Acceptance of Terms",
    body: [
      "By accessing or using Lunaar's chatbot builder, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you must not use this service.",
    ],
  },
  {
    title: "Ownership of Content & Knowledge Data",
    body: [
      <>
        Documents, text, images, and other content you provide to train,
        instruct, or inform your bot remain{" "}
        <strong style={s.highlight}>
          the property of you or the respective original creator or rights
          holder, and not of Lunaar or any individual associated with Lunaar
        </strong>
        . Lunaar makes no ownership claim over this content and does not
        warrant that use of any third-party material is free of third-party
        rights.
      </>,
      "Users are responsible for ensuring they have the appropriate rights, licenses, or permissions for any content they add to a bot, and for giving proper attribution where required by the original rights holder.",
    ],
  },
  {
    title: "Changes to These Terms",
    body: [
      "Lunaar reserves the right to modify, update, or replace these Terms & Conditions at any time, at our sole discretion and without prior notice. Continued use of the service after any changes are posted constitutes acceptance of the revised terms. It is your responsibility to review this page periodically.",
    ],
  },
  {
    title: "Bot Usage License",
    body: [
      "Subject to your compliance with these terms, Lunaar grants you a free license to build, deploy, and use the bots you create, and the responses they produce, for personal or commercial purposes. This license does not extend to any underlying third-party content, which remains subject to its original owners' rights as described above.",
    ],
  },
  {
    title: "Prohibited Use",
    body: [
      "You may not use the service to build bots that produce or promote content that is unlawful, infringing, defamatory, obscene, deceptive, or that violates the intellectual property or privacy rights of any third party. Lunaar reserves the right to suspend or block access to bots found to be in violation of this policy.",
    ],
  },
  {
    title: "Limitation of Liability",
    body: [
      'The service is provided "as is" without warranties of any kind. Bot responses are generated by third-party AI models and may be inaccurate or incomplete. Lunaar shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service, from bot responses, or from any third-party content or provider charges.',
    ],
  },
  {
    title: "API Key Responsibility",
    body: [
      "Lunaar is free to use and works on a bring-your-own-key basis. You are responsible for keeping your API keys confidential, for all usage and charges incurred with your AI provider, and for all activity that occurs through your keys. Revoke and replace any key you believe has been compromised.",
    ],
  },
  {
    title: "Governing Law",
    body: [
      "These Terms & Conditions are governed by and construed in accordance with applicable local laws, without regard to conflict of law principles.",
    ],
  },
  {
    title: "Contact",
    body: [
      "For questions about these Terms & Conditions, reach out through the contact options available on the Lunaar website.",
    ],
  },
];

const Terms = () => {
  return (
    <div style={s.page}>
      <header style={s.nav}>
        <Link to="/" style={s.brand}>
          <span style={s.brandMark}>
            <Bot size={18} />
          </span>
          Lunaar
        </Link>
        <Link to="/" style={s.backLink}>
          Back to home
        </Link>
      </header>

      <div style={s.hero}>
        <p style={s.eyebrow}>Legal</p>
        <h1 style={s.title}>Terms &amp; Conditions</h1>
        <p style={s.subtitle}>
          AI Chatbot Builder — please read carefully before using Lunaar's
          chatbot tools.
        </p>
        <p style={s.updated}>Last updated: October 18, 2026</p>
      </div>

      <main style={s.content}>
        {sections.map((sec, i) => (
          <section key={sec.title} style={s.section}>
            <h2 style={s.sectionTitle}>
              <span style={s.sectionNumber}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {sec.title}
            </h2>
            {sec.body.map((p, j) => (
              <p
                key={j}
                style={{
                  ...s.text,
                  marginBottom: j === sec.body.length - 1 ? 0 : 12,
                }}
              >
                {p}
              </p>
            ))}
          </section>
        ))}
      </main>

      <footer style={s.footer}>
        <p style={s.footerText}>
          © {new Date().getFullYear()} Lunaar. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Terms;
