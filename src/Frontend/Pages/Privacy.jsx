
import styles from "../Styles/Privacy.module.css";

const LAST_UPDATED = "April 2026";

const googleScopes = [
  {
    service: "Google Calendar",
    icon: "📅",
    scope: "calendar.events",
    chatbot: "Assistant Chatbot",
    purpose:
      "Read and create calendar events so the Assistant chatbot can schedule meetings, reservations, and appointments on behalf of your visitors.",
    actions: [
      "View existing events to check availability",
      "Create new events when a visitor books a meeting or reservation",
      "Access calendar metadata (timezone, title) needed to place events correctly",
    ],
  },
  {
    service: "Gmail — Send only",
    icon: "✉️",
    scope: "gmail.send",
    chatbot: "Agentic Chatbot",
    purpose:
      "Send notification emails to the chatbot owner when a visitor submits a query. Lunaar never reads, stores, or indexes your inbox.",
    actions: [
      "Send one notification email per visitor query",
      "Include visitor-provided details in that email",
      "No read access — your inbox remains entirely private",
    ],
  },
];

const sections = [
  {
    number: "01",
    title: "Who we are",
    items: [
      "Lunaar (lunaar.online) is a platform that lets businesses create and embed custom AI chatbots on their websites.",
      "We offer three chatbot types: Info Chatbot (answers questions from your content), Agentic Chatbot (notifies you by email when queries arrive), and Assistant Chatbot (schedules meetings via Google Calendar).",
      "This Privacy Policy explains how we collect, use, and protect data — including data obtained through Google OAuth — when you use Lunaar.",
      "For any privacy questions, contact us at LunaarOffical@gmail.com.",
    ],
  },
  {
    number: "02",
    title: "Data we collect",
    items: [
      "Account data: name, email address, and password (hashed) provided during registration.",
      "Chatbot content: documents, PDFs, URLs, and prompts you upload to train your chatbots — used solely to generate responses.",
      "Visitor interaction logs: messages sent to your chatbots, retained to support chatbot functionality and improvement.",
      "Google OAuth tokens: access and refresh tokens for Google services you explicitly authorise, stored securely and used only as described in Section 03.",
      "Usage metadata: page views, feature interactions, and error logs used to improve the platform.",
    ],
  },
  {
    number: "03",
    title: "Google OAuth & sensitive scopes",
    highlight: true,
    googleScopes: true,
    items: [
      "Lunaar's use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements.",
      "We only request Google permissions that are strictly necessary for the chatbot feature you enable.",
      "Google OAuth tokens are encrypted at rest and never shared with third parties.",
      "You can revoke Lunaar's Google access at any time via myaccount.google.com/permissions or from your Lunaar dashboard.",
      "Revoking access disables the relevant chatbot feature but does not delete your Lunaar account or other data.",
    ],
  },
  {
    number: "04",
    title: "How we use your data",
    items: [
      "To operate and deliver the Lunaar platform and chatbot features you configure.",
      "To send transactional emails (e.g. account verification, password reset) — we do not send marketing emails without consent.",
      "To detect, investigate, and prevent abuse, fraud, and security incidents.",
      "To improve platform performance and fix bugs using anonymised analytics.",
      "We do not use your data or your visitors' data to train any external AI model.",
      "We do not sell, rent, or share your personal data with advertisers or data brokers.",
    ],
  },
  {
    number: "05",
    title: "Data sharing & sub-processors",
    items: [
      "We use a limited set of sub-processors to operate the platform (e.g. cloud hosting, AI inference providers). All sub-processors are contractually bound to protect your data.",
      "We may disclose data if required by law, court order, or to protect the rights and safety of Lunaar and its users.",
      "We never share data obtained via Google APIs with any third party except as minimally necessary to operate the specific Google-powered feature.",
    ],
  },
  {
    number: "06",
    title: "Data retention & deletion",
    items: [
      "Account data is retained for as long as your account is active.",
      "Chatbot content and visitor logs are retained until you delete the chatbot or your account.",
      "Google OAuth tokens are deleted immediately upon revocation or account deletion.",
      "During the beta period, data persistence is not guaranteed. Please keep local copies of important content.",
      "To permanently delete your account and all associated data, email LunaarOffical@gmail.com with the subject 'Delete my account'.",
    ],
  },
  {
    number: "07",
    title: "Security",
    items: [
      "All data is transmitted over TLS (HTTPS). Sensitive credentials and OAuth tokens are encrypted at rest.",
      "We follow industry-standard practices for access control, logging, and vulnerability management.",
      "As a beta product, security measures are actively evolving. We recommend not storing highly sensitive business data on the platform during this period.",
      "Please report security vulnerabilities responsibly to LunaarOffical@gmail.com.",
    ],
  },
  {
    number: "08",
    title: "Your rights",
    items: [
      "Access: You may request a copy of the personal data we hold about you.",
      "Correction: You may update or correct inaccurate data via your account settings or by contacting us.",
      "Deletion: You may request deletion of your personal data at any time (see Section 06).",
      "Portability: You may request an export of your chatbot content and account data in a machine-readable format.",
      "To exercise any of these rights, contact LunaarOffical@gmail.com.",
    ],
  },
  {
    number: "09",
    title: "Cookies & tracking",
    items: [
      "We use strictly necessary cookies to maintain your login session.",
      "We may use analytics cookies to understand platform usage — these can be disabled in your browser without affecting core functionality.",
      "We do not use advertising or cross-site tracking cookies.",
      "The chatbot embed script placed on your website may set a session cookie for the visitor's conversation context only.",
    ],
  },
  {
    number: "10",
    title: "Children's privacy",
    items: [
      "Lunaar is not directed at children under the age of 13.",
      "We do not knowingly collect personal data from children. If we become aware that a child has provided us data, we will delete it promptly.",
    ],
  },
  {
    number: "11",
    title: "Changes to this policy",
    items: [
      "We may update this Privacy Policy at any time. The 'Last updated' date at the top reflects the most recent revision.",
      "For material changes, we will notify you via email or an in-app notice at least 7 days before the change takes effect.",
      "Continued use of Lunaar after changes constitutes acceptance of the updated policy.",
    ],
  },
  {
    number: "12",
    title: "Contact",
    items: [
      "Data controller: Lunaar (lunaar.online)",
      "For privacy questions, data requests, or to report a concern: LunaarOffical@gmail.com",
    ],
  },
];

export function Privacy() {
  return (
    <div className={styles.terms_wrapper}>
      <div className={styles.terms_content}>

        {/* Hero */}
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Legal</span>
          <h1>Privacy Policy</h1>
          <p>
            Last updated — {LAST_UPDATED}. This policy describes how Lunaar
            collects, uses, and protects your data — including data accessed via
            Google OAuth.
          </p>
        </section>

        {/* Google compliance banner */}
        <div className={styles.google_banner}>
          <span className={styles.google_banner_icon}>🔒</span>
          <div>
            <strong>Google API Limited Use Disclosure</strong>
            <span>
              Lunaar's use and transfer of information received from Google APIs
              adheres to the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </span>
          </div>
        </div>

        {/* Sections */}
        <div className={styles.sections_list}>
          {sections.map((section) => (
            <div
              key={section.number}
              className={`${styles.section} ${
                section.highlight ? styles.highlighted : ""
              }`}
            >
              <div className={styles.section_header}>
                <span className={styles.section_number}>{section.number}</span>
                <h2 className={styles.section_title}>{section.title}</h2>
              </div>

              {/* Google scope cards */}
              {section.googleScopes && (
                <div className={styles.scope_cards}>
                  {googleScopes.map((gs) => (
                    <div key={gs.service} className={styles.scope_card}>
                      <div className={styles.scope_card_header}>
                        <span className={styles.scope_icon}>{gs.icon}</span>
                        <div>
                          <div className={styles.scope_service}>
                            {gs.service}
                          </div>
                          <div className={styles.scope_badge_row}>
                            <span className={styles.scope_chip}>
                              {gs.chatbot}
                            </span>
                            <code className={styles.scope_code}>{gs.scope}</code>
                          </div>
                        </div>
                      </div>
                      <p className={styles.scope_purpose}>{gs.purpose}</p>
                      <ul className={styles.scope_list}>
                        {gs.actions.map((a, i) => (
                          <li key={i} className={styles.scope_list_item}>
                            <span className={styles.scope_check}>✓</span>
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              <ul className={styles.section_items}>
                {section.items.map((item, i) => (
                  <li key={i} className={styles.section_item}>
                    <span className={styles.bullet} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.footer_note}>
          Questions about your privacy? Email us at{" "}
          <a href="mailto:LunaarOffical@gmail.com">LunaarOffical@gmail.com</a>
        </div>
      </div>
    </div>
  );
}