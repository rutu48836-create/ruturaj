import { NavBar } from "../Components/NavBar";
import styles from "../Styles/Contact.module.css";

const categories = [
  {
    icon: "📧",
    title: "General support",
    description:
      "Questions, feedback, or anything else — we're here. Include a clear subject line and your browser/device info for bug reports.",
    detail: "Response within 24–48 hours on business days.",
    email: "LunaarOffical@gmail.com",
    color: "#2563eb",
    bg: "#eff6ff",
  },
  {
    icon: "🤝",
    title: "Business & collaboration",
    description:
      "Partnerships, sponsorships, or integration opportunities — we welcome them all. Tell us about your proposal and we'll be in touch.",
    detail: "Response within 3–5 business days.",
    email: "LunaarOffical@gmail.com",
    color: "#059669",
    bg: "#ecfdf5",
  },
  {
    icon: "💡",
    title: "Beta feedback",
    description:
      "Lunaar is in beta and your input shapes what we build next. Share feature requests, bugs, or anything you'd like to see improved.",
    detail: "Every message is reviewed by our dev team.",
    email: "LunaarOffical@gmail.com",
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
];

export function Contact() {
  return (
    <div className={styles.contact_wrapper}>
      <NavBar />
      <div className={styles.contact_content}>

        {/* Hero */}
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Contact</span>
          <h1>We'd love to hear from you.</h1>
          <p>
            Whether you need support, want to collaborate, or just have feedback —
            reach out and we'll get back to you as soon as possible.
          </p>
        </section>

        {/* Cards */}
        <div className={styles.cards_grid}>
          {categories.map((cat, i) => (
            <div className={styles.card} key={i}>
              <div className={styles.card_icon} style={{ background: cat.bg, color: cat.color }}>
                {cat.icon}
              </div>
              <h3 className={styles.card_title}>{cat.title}</h3>
              <p className={styles.card_description}>{cat.description}</p>
              <span className={styles.card_detail}>{cat.detail}</span>
              <a
                href={`mailto:${cat.email}`}
                className={styles.card_email}
                style={{ color: cat.color, borderColor: cat.color + '30', background: cat.bg }}
              >
                {cat.email} →
              </a>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className={styles.bottom_note}>
          <span className={styles.beta_badge}>⚠️ Beta</span>
          <span>
            Lunaar is actively being developed. Features and responses may evolve.
            Thank you for being an early supporter.
          </span>
        </div>

      </div>
    </div>
  );
}