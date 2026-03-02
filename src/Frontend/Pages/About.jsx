import { NavBar } from "../Components/NavBar";
import styles from "../Styles/About.module.css";

export function About() {
  return (
    <div className={styles.About_wrapper}>
      <NavBar />
      <div className={styles.About_content}>

        {/* Hero */}
        <section className={styles.hero}>
          <span className={styles.eyebrow}>About Lunaar</span>
          <h1>Build Your Own AI Chatbot — For Free.</h1>
          <p>
            Lunaar empowers anyone — students, creators, businesses — to create
            a fully custom AI chatbot in minutes, train it with their own content,
            and share it with the world via a single link. No code. No cost. No limits.
          </p>
        </section>

        <div className={styles.divider} />

        {/* What is Lunaar */}
        <section className={styles.section}>
          <h2>What is Lunaar?</h2>
          <span>
            Lunaar is a free AI chatbot builder that lets you create, train, and share
            intelligent chatbots with zero technical knowledge required.
          </span>
          <span>
            Simply upload your PDFs, paste your text, or add your documentation — Lunaar
            trains a chatbot on your content and gives you a shareable link instantly.
            Whether it's a customer support bot, a study assistant, or a personal knowledge
            base, Lunaar makes it effortless.
          </span>
        </section>

        <div className={styles.divider} />

        {/* Features */}
        <section className={styles.section}>
          <h2>What You Can Do</h2>
          <div className={styles.features_grid}>
            <div className={styles.feature_card}>
              <h3>Upload PDFs & Text</h3>
              <span>
                Train your chatbot by uploading PDF documents, plain text, or pasting
                content directly. Your bot learns from your material instantly.
              </span>
            </div>
            <div className={styles.feature_card}>
              <h3>Get a Shareable Link</h3>
              <span>
                Every chatbot gets a unique public link. Share it with anyone —
                no sign-in needed for visitors.
              </span>
            </div>
            <div className={styles.feature_card}>
              <h3>Custom AI, Your Way</h3>
              <span>
                Give your chatbot a name and purpose. It answers only based on
                the content you provide.
              </span>
            </div>
            <div className={styles.feature_card}>
              <h3>100% Free</h3>
              <span>
                No hidden fees, no credit card required. Build as many bots
                as you need during our beta phase.
              </span>
            </div>
          </div>
        </section>

        <div className={styles.divider} />

        {/* How it works */}
        <section className={styles.section}>
          <h2>How It Works</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.step_number}>01</span>
              <div>
                <h3>Create Your Bot</h3>
                <span>Sign up for free and give your chatbot a name and description.</span>
              </div>
            </div>
            <div className={styles.step}>
              <span className={styles.step_number}>02</span>
              <div>
                <h3>Upload Your Content</h3>
                <span>Upload PDFs, paste text, or add any content you want the bot to learn from.</span>
              </div>
            </div>
            <div className={styles.step}>
              <span className={styles.step_number}>03</span>
              <div>
                <h3>Train & Deploy</h3>
                <span>Lunaar processes your content and builds an AI chatbot trained on your material.</span>
              </div>
            </div>
            <div className={styles.step}>
              <span className={styles.step_number}>04</span>
              <div>
                <h3>Share Your Link</h3>
                <span>Get a unique shareable URL and send it to anyone. They can chat instantly.</span>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.divider} />

      

        <section className={styles.section}>
          <span className={styles.beta_notice}>
            ⚠️ Lunaar is currently in beta. Features are actively being developed.
            Reach us at <a href="mailto:LunaarOffical@gmail.com">LunaarOffical@gmail.com</a>
          </span>
        </section>

      </div>
    </div>
  );
}