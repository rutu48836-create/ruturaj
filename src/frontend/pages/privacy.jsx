import styles from "../Styles/Docs.module.css";
import { Navbar } from "../components/landing_nav";

const steps = [
  {
    number: "01",
    title: "Name your bot and set its purpose",
    text: "Give your bot a name and describe what it should do — its role, tone, personality, and the kinds of questions it should handle. The more specific your instructions, the closer the bot behaves to what you have in mind.",
  },
  {
    number: "02",
    title: "Select a provider",
    text: "Choose which AI provider powers your bot: Groq, Claude, or Gemini. Each provider responds a little differently, so you can switch providers to compare results.",
  },
  {
    number: "03",
    title: "Paste your API key",
    text: "Enter your own API key for the selected provider. Lunaar is bring-your-own-key, so you stay in control of your key and pay your provider directly at their rates. Lunaar itself charges nothing.",
  },
  {
    number: "04",
    title: "Add knowledge",
    text: "Add the content your bot should rely on, such as FAQs, product details, policies, or documentation. Your bot uses this knowledge to give accurate answers about your business instead of guessing.",
  },
  {
    number: "05",
    title: "Test and embed your bot",
    text: "Chat with your bot in the live preview and adjust its instructions until it responds the way you want. When you are happy, copy the embed snippet and paste it into your website to go live.",
  },
  {
    number: "06",
    title: "No sign up needed",
    text: "There is no account to create and no login to remember. Open the builder, add your key, and start building your bot right away.",
  },
];

const Docs = () => {
  return (
    <div className={styles.page}>
      <Navbar />

      <header className={styles.hero}>
        <p className={styles.eyebrow}>Documentation</p>
        <h1 className={styles.title}>How to use Lunaar</h1>
        <p className={styles.subtitle}>
          A step-by-step guide to building AI chatbots — from first
          instructions to a live bot on your site.
        </p>
      </header>

      <main className={styles.content}>
        <section className={styles.stepsSection}>
          {steps.map((step) => (
            <div key={step.number} className={styles.stepCard}>
              <span className={styles.stepNumber}>{step.number}</span>
              <div className={styles.stepBody}>
                <h2 className={styles.stepTitle}>{step.title}</h2>
                <p className={styles.stepText}>{step.text}</p>
              </div>
            </div>
          ))}
        </section>

        <section className={styles.noteSection}>
          <h2 className={styles.noteTitle}>Free and BYOK</h2>
          <div className={styles.noteGrid}>
            <div className={styles.noteCard}>
              <span className={styles.noteHighlight}>$0</span>
              <p className={styles.noteText}>
                Lunaar is completely free. There are no plans, tiers, or
                trials.
              </p>
            </div>
            <div className={styles.noteCard}>
              <span className={styles.noteHighlight}>Your key</span>
              <p className={styles.noteText}>
                AI usage is billed by your provider directly, with no markup
                from Lunaar.
              </p>
            </div>
            <div className={styles.noteCard}>
              <span className={styles.noteHighlight}>No sign up</span>
              <p className={styles.noteText}>
                Start building immediately without creating an account.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.tipSection}>
          <h2 className={styles.tipTitle}>Quick tips</h2>
          <ul className={styles.tipList}>
            <li className={styles.tipItem}>
              Keep your API key private and revoke it with your provider if
              you ever think it has been exposed.
            </li>
            <li className={styles.tipItem}>
              Write clear instructions for your bot, including what it
              should and should not talk about.
            </li>
            <li className={styles.tipItem}>
              Message limits depend on your provider's plan, so check your
              provider's dashboard if responses ever stop.
            </li>
            <li className={styles.tipItem}>
              Keep your knowledge content up to date so your bot always
              answers with current information.
            </li>
          </ul>
        </section>
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          © {new Date().getFullYear()} Lunaar. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Docs;
