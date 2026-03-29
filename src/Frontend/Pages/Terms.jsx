import { NavBar } from "../Components/NavBar";
import styles from "../Styles/Terms.module.css";

const sections = [
  {
    number: "01",
    title: "Beta notice",
    highlight: true,
    items: [
      "Lunaar is under active development. Features may be added, changed, or removed at any time without prior notice.",
      "The platform may contain bugs, errors, or incomplete functionality.",
      "We do not guarantee uninterrupted availability or data persistence during the beta period.",
      "We are not liable for any loss of data, revenue, or business impact resulting from beta instability.",
      "Beta access may be revoked or restricted at any time at our discretion.",
    ],
  },
  {
    number: "02",
    title: "Account registration",
    items: [
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "You are responsible for all activity that occurs under your account.",
      "You must provide accurate and up-to-date information during registration.",
      "Notify us immediately if you suspect unauthorised access to your account.",
      "We reserve the right to suspend or terminate accounts that violate these Terms.",
    ],
  },
  {
    number: "03",
    title: "Acceptable use",
    items: [
      "You may not use Lunaar to generate, distribute, or promote illegal, harmful, or misleading content.",
      "You may not attempt to reverse-engineer, scrape, or abuse the platform's infrastructure.",
      "AI agents must not be used to deceive, manipulate, or harm end users.",
      "We reserve the right to remove any chatbot that violates these guidelines without notice.",
    ],
  },
  {
    number: "04",
    title: "Data & privacy",
    items: [
      "We collect only the data necessary to operate the service.",
      "Content you upload (PDFs, prompts, website data) is used solely to power your chatbots.",
      "We do not sell your data to third parties.",
      "During beta, data persistence is not guaranteed. Please keep local copies of important content.",
    ],
  },
  {
    number: "05",
    title: "Intellectual property",
    items: [
      "You retain ownership of all content you upload to Lunaar.",
      "By uploading content, you grant Lunaar a limited licence to process it for the purpose of running your chatbots.",
      "The Lunaar name, logo, and platform code are our intellectual property and may not be copied or reused.",
    ],
  },
  {
    number: "06",
    title: "Limitation of liability",
    items: [
      "Lunaar is provided 'as is' without warranties of any kind, express or implied.",
      "We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.",
      "Our total liability to you shall not exceed the amount you have paid us in the past 12 months.",
    ],
  },
  {
    number: "07",
    title: "Changes to these terms",
    items: [
      "We may update these Terms at any time. Continued use of the platform after changes constitutes acceptance.",
      "We will make reasonable efforts to notify users of significant changes via email or in-app notice.",
    ],
  },
  {
    number: "08",
    title: "Contact",
    items: [
      "For questions about these Terms, reach us at LunaarOffical@gmail.com.",
    ],
  },
];

export function Terms() {
  return (
    <div className={styles.terms_wrapper}>
      <NavBar />
      <div className={styles.terms_content}>

        {/* Hero */}
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Legal</span>
          <h1>Terms & Conditions</h1>
          <p>Last updated — March 2026. Please read these terms carefully before using Lunaar.</p>
        </section>

        {/* Beta banner */}
        <div className={styles.beta_banner}>
          <span className={styles.beta_icon}>⚠️</span>
          <div>
            <strong>Beta product</strong>
            <span>Lunaar is currently in beta. Features are actively being developed and may change without notice.</span>
          </div>
        </div>

        {/* Sections */}
        <div className={styles.sections_list}>
          {sections.map((section) => (
            <div
              key={section.number}
              className={`${styles.section} ${section.highlight ? styles.highlighted : ''}`}
            >
              <div className={styles.section_header}>
                <span className={styles.section_number}>{section.number}</span>
                <h2 className={styles.section_title}>{section.title}</h2>
              </div>
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
          Questions? Email us at{" "}
          <a href="mailto:LunaarOffical@gmail.com">LunaarOffical@gmail.com</a>
        </div>

      </div>
    </div>
  );
}