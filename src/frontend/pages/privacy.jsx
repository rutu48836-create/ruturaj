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
    margin: 0,
    color: c.muted,
    fontSize: "0.96rem",
  },
  list: {
    margin: "12px 0 0",
    paddingLeft: 20,
    color: c.muted,
    fontSize: "0.96rem",
  },
  listItem: {
    marginBottom: 6,
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
    title: "Introduction",
    text: "This Privacy Policy explains how Lunaar handles information when you use our AI chatbot builder. Lunaar is free to use, works on a bring-your-own-key basis, and does not require you to create an account. We aim to collect as little information as possible.",
  },
  {
    title: "Information We Collect",
    text: "Because there is no sign up or login, we do not ask for your name, email address, or password. Depending on how you use the service, we may handle:",
    list: [
      "Bot configuration you create, such as names, instructions, and appearance settings",
      "Knowledge content you add so your bot can answer questions",
      "Messages sent to and from your bots, which are processed to generate responses",
      "Basic technical data such as browser type, device information, and IP address, used to run and secure the service",
    ],
  },
  {
    title: "Your API Keys",
    text: "Lunaar is bring-your-own-key. The API key you provide is used only to send requests to the AI provider you select, on your behalf, so your bot can respond. We do not sell your keys or use them for any other purpose. You remain responsible for your key and its usage, and you should revoke it with your provider if you believe it has been exposed.",
  },
  {
    title: "How We Use Information",
    text: "We use the information described above to operate and deliver your bots, keep the service secure, diagnose problems, and improve Lunaar. We do not sell your personal information.",
  },
  {
    title: "Third-Party AI Providers",
    text: "To generate responses, your bot's instructions, knowledge content, and conversation messages are sent to the AI provider you choose, such as Groq, Anthropic (Claude), or Google (Gemini). These providers process data under their own terms and privacy policies, which we encourage you to review. Lunaar does not control how they handle data once it reaches them.",
  },
  {
    title: "Bots on Your Website",
    text: "If you embed a Lunaar bot on your website, visitors' chat messages are processed to produce replies. You are responsible for informing your visitors that they are talking to an AI bot and for complying with the privacy laws that apply to your site. Visitors should avoid sharing sensitive personal information such as passwords, payment details, or health data in a bot chat.",
  },
  {
    title: "Cookies & Local Storage",
    text: "We may use cookies or your browser's local storage to keep the site working properly and remember basic preferences. You can clear or block these in your browser settings, though some features may not work as expected.",
  },
  {
    title: "Data Retention & Deletion",
    text: "We keep information only as long as it is needed to provide the service or meet legal obligations. If you would like information associated with your bots removed, contact us and we will help with your request.",
  },
  {
    title: "Changes to This Policy",
    text: "We may update this Privacy Policy from time to time. Changes take effect when posted on this page, and continued use of the service means you accept the updated policy. Please review this page periodically.",
  },
  {
    title: "Contact",
    text: "For questions about this Privacy Policy or your data, reach out through the contact options available on the Lunaar website.",
  },
];

const Privacy = () => {
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
        <h1 style={s.title}>Privacy Policy</h1>
        <p style={s.subtitle}>
          How Lunaar handles your information when you build and run AI
          chatbots.
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
            <p style={s.text}>{sec.text}</p>
            {sec.list && (
              <ul style={s.list}>
                {sec.list.map((item) => (
                  <li key={item} style={s.listItem}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
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

export default Privacy;
