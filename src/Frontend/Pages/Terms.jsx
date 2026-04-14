import { NavBar } from "../Components/NavBar";
import styles from "../Styles/Terms.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";

const sections = [
  {
    id: "beta",
    tag: "⚠️ 01 — Beta Notice",
    tagColor: "#dc2626",
    tagBg: "#fef2f2",
    headline: "We're still building. Here's what that means for you.",
    description:
      "Lunaar is under active development. While we work hard to keep things stable, there are things we can't yet guarantee — and you should know about them before relying on the platform for critical work.",
    note: null,
    highlight: "Beta access may be revoked or restricted at any time at our discretion. Data persistence is not guaranteed during this period.",
    clauses: [
      { title: "Active development", body: "Lunaar is under active development. Features may be added, changed, or removed at any time without prior notice." },
      { title: "Bugs & incomplete features", body: "The platform may contain bugs, errors, or incomplete functionality." },
      { title: "Availability & data persistence", body: "We do not guarantee uninterrupted availability or data persistence during the beta period." },
      { title: "Liability limitations", body: "We are not liable for any loss of data, revenue, or business impact resulting from beta instability." },
      { title: "Access revocation", body: "Beta access may be revoked or restricted at any time at our discretion." },
    ],
  },
  {
    id: "account",
    tag: "👤 02 — Account Registration",
    tagColor: "#2563eb",
    tagBg: "#eff6ff",
    headline: "Your account, your responsibility.",
    description:
      "When you register for Lunaar, you take on certain responsibilities. Keep your credentials secure, your information accurate, and notify us if anything looks wrong.",
    note: null,
    highlight: null,
    clauses: [
      { title: "Credential confidentiality", body: "You are responsible for maintaining the confidentiality of your account credentials." },
      { title: "Account activity", body: "You are responsible for all activity that occurs under your account." },
      { title: "Accurate information", body: "You must provide accurate and up-to-date information during registration." },
      { title: "Unauthorised access", body: "Notify us immediately if you suspect unauthorised access to your account." },
      { title: "Account termination", body: "We reserve the right to suspend or terminate accounts that violate these Terms." },
    ],
  },
  {
    id: "use",
    tag: "✅ 03 — Acceptable Use",
    tagColor: "#059669",
    tagBg: "#ecfdf5",
    headline: "Build great things. Don't cause harm.",
    description:
      "Lunaar is built to help you create AI agents that genuinely help people. We have a few firm rules to keep the platform safe and trustworthy for everyone.",
    note: "We reserve the right to remove any chatbot that violates these guidelines without notice.",
    highlight: null,
    clauses: [
      { title: "No harmful content", body: "You may not use Lunaar to generate, distribute, or promote illegal, harmful, or misleading content." },
      { title: "No abuse of infrastructure", body: "You may not attempt to reverse-engineer, scrape, or abuse the platform's infrastructure." },
      { title: "No deception via agents", body: "AI agents must not be used to deceive, manipulate, or harm end users." },
      { title: "Chatbot removal", body: "We reserve the right to remove any chatbot that violates these guidelines without notice." },
    ],
  },
  {
    id: "billing",
    tag: "💳 04–05 — Pricing & Refunds",
    tagColor: "#d97706",
    tagBg: "#fffbeb",
    headline: "Transparent pricing. No surprise charges.",
    description:
      "Lunaar Pro is ₹399/month. You can cancel anytime — no annual commitment required. All payments are non-refundable, so please reach out within 7 days if you believe there's been a billing error.",
    note: "Upon cancellation, your plan downgrades to free immediately. No refund is issued for remaining days in the billing cycle.",
    highlight: null,
    clauses: [
      { title: "Pro plan pricing", body: "The Lunaar Pro plan is priced at ₹399 per month. Dollar and other currency pricing may vary based on region and exchange rates." },
      { title: "Billing cycle", body: "You will be billed at the start of each billing cycle." },
      { title: "Taxes", body: "All prices are exclusive of applicable taxes unless stated otherwise." },
      { title: "Price changes", body: "We reserve the right to change pricing with reasonable notice to existing subscribers." },
      { title: "Non-refundable payments", body: "All payments made to Lunaar are non-refundable. We do not offer refunds for any reason, including partial use of a billing period." },
      { title: "Cancellation", body: "You are not required to complete a full 12-month commitment — you may cancel your Pro plan at any time." },
      { title: "Post-cancellation access", body: "Upon cancellation, your plan will be downgraded to the free tier immediately and you will lose access to Pro features." },
      { title: "Remaining cycle days", body: "No refund will be issued for the remaining days in your current billing cycle after cancellation." },
      { title: "Billing errors", body: "If you believe you have been charged in error, contact us at LunaarOffical@gmail.com within 7 days of the charge." },
    ],
  },
  {
    id: "data",
    tag: "🔒 06–07 — Data & Intellectual Property",
    tagColor: "#7c3aed",
    tagBg: "#f5f3ff",
    headline: "Your content stays yours. We just power it.",
    description:
      "We collect only what we need to run the service. You retain full ownership of everything you upload. We never sell your data and only use it to make your chatbots work.",
    note: "During beta, data persistence is not guaranteed. Please keep local copies of important content.",
    highlight: null,
    clauses: [
      { title: "Minimal data collection", body: "We collect only the data necessary to operate the service." },
      { title: "Content usage", body: "Content you upload (PDFs, prompts, website data) is used solely to power your chatbots." },
      { title: "No data sales", body: "We do not sell your data to third parties." },
      { title: "Beta data persistence", body: "During beta, data persistence is not guaranteed. Please keep local copies of important content." },
      { title: "Content ownership", body: "You retain ownership of all content you upload to Lunaar." },
      { title: "Limited processing licence", body: "By uploading content, you grant Lunaar a limited licence to process it for the purpose of running your chatbots." },
      { title: "Lunaar IP", body: "The Lunaar name, logo, and platform code are our intellectual property and may not be copied or reused." },
    ],
  },
  {
    id: "legal",
    tag: "⚖️ 08–10 — Liability, Changes & Contact",
    tagColor: "#6b6b67",
    tagBg: "#f3f3f0",
    headline: "The legal stuff, kept plain and simple.",
    description:
      "Lunaar is provided as-is. We'll let you know if these terms change. And if you have any questions at all, we're just an email away.",
    note: null,
    highlight: null,
    clauses: [
      { title: "As-is provision", body: "Lunaar is provided 'as is' without warranties of any kind, express or implied." },
      { title: "No indirect damages", body: "We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform." },
      { title: "Liability cap", body: "Our total liability to you shall not exceed the amount you have paid us in the past 12 months." },
      { title: "Terms updates", body: "We may update these Terms at any time. Continued use of the platform after changes constitutes acceptance." },
      { title: "Change notifications", body: "We will make reasonable efforts to notify users of significant changes via email or in-app notice." },
      { title: "Contact", body: "For questions about these Terms, reach us at LunaarOffical@gmail.com." },
    ],
  },
];

const heroNav = [
  { id: "beta",    label: "Beta Notice",  color: "#dc2626" },
  { id: "account", label: "Account",      color: "#2563eb" },
  { id: "use",     label: "Acceptable Use", color: "#059669" },
  { id: "billing", label: "Billing",      color: "#d97706" },
  { id: "data",    label: "Data & IP",    color: "#7c3aed" },
  { id: "legal",   label: "Legal",        color: "#6b6b67" },
];

function AccordionCard({ section }) {
  const [open, setOpen] = useState(null);

  return (
    <div className={styles.accordion_card}>
      <div className={styles.accordion_header}>
        <span>Clauses</span>
        <span className={styles.clause_count}>{section.clauses.length} clauses</span>
      </div>
      <div className={styles.accordion_list}>
        {section.clauses.map((clause, i) => (
          <div
            key={i}
            className={`${styles.acc_item} ${open === i ? styles.acc_open : ""}`}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <div className={styles.acc_item_header}>
              <span className={styles.acc_num} style={{ color: section.tagColor }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={styles.acc_title}>{clause.title}</span>
              <span className={styles.acc_chevron}>{open === i ? "−" : "+"}</span>
            </div>
            {open === i && <div className={styles.acc_body}>{clause.body}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function TermSection({ section, index }) {
  const isEven = index % 2 === 0;

  return (
    <section
      className={`${styles.term_section} ${isEven ? styles.even : styles.odd}`}
      id={section.id}
    >
      <div className={styles.term_inner}>
        <div className={styles.term_left}>
          <span
            className={styles.term_tag}
            style={{ color: section.tagColor, background: section.tagBg }}
          >
            {section.tag}
          </span>
          <h2 className={styles.term_headline}>{section.headline}</h2>
          <p className={styles.term_description}>{section.description}</p>

          {section.highlight && (
            <div className={styles.highlight_banner}>
              <span>🚧</span>
              <span>{section.highlight}</span>
            </div>
          )}

          {section.note && (
            <div className={styles.term_note}>
              <span className={styles.note_icon}>💡</span>
              <span>{section.note}</span>
            </div>
          )}
        </div>

        <div className={styles.term_right}>
          <AccordionCard section={section} />
        </div>
      </div>
    </section>
  );
}

export function Terms() {
  return (
    <div className={styles.terms_wrapper}>
      <NavBar />

      <div className={styles.terms_content}>

        {/* Hero */}
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Terms of Service</span>
          <h1>Simple, clear, honest terms.</h1>
          <p>
            We've written our terms in plain language. Here's everything that
            governs your use of Lunaar.
          </p>
          <div className={styles.hero_nav}>
            {heroNav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={styles.hero_nav_btn}
                style={{ borderColor: item.color, color: item.color }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </section>

        {/* Notice banner */}
        <section className={styles.notice_section}>
          <div className={styles.notice_banner}>
            <span className={styles.notice_icon}>📋</span>
            <div>
              <strong>Applies to all users</strong>
              <span>
                By using Lunaar, you agree to these Terms of Service. Last
                updated April 2025. Questions? Reach us at LunaarOffical@gmail.com.
              </span>
            </div>
          </div>
        </section>

        <div className={styles.divider} />

        {/* Term sections */}
        {sections.map((section, i) => (
          <TermSection key={section.id} section={section} index={i} />
        ))}

        <div className={styles.divider} />

        {/* CTA */}
        <section className={styles.cta_section}>
          <h2>Got questions about the terms?</h2>
          <p>We're happy to clarify anything. Reach out and we'll get back to you.</p>
          <a href="mailto:LunaarOffical@gmail.com" className={styles.cta_btn}>
            Contact us →
          </a>
        </section>

      </div>
    </div>
  );
}
