import { SendHorizonal } from "lucide-react";
import styles from "../Styles/Homepage.module.css"; 
import Hero from "../assets/Hero.png";

export function Homepage() {
  return (
    <div className={styles.Homepage_wrapper}>

      <div className={styles.Navbar}>
        <div className={styles.logo}>
          Lunaar <SendHorizonal size={18} />
        </div>
        <div className={styles.Nav_btns}>
          {/* ✅ Replaced <a><button> with styled <button onClick> or use Link */}
          <button className={styles.login_btn} onClick={() => window.location.href = "/Dashboard"}>
            Log in
          </button>
          <button className={styles.sign_up} onClick={() => window.location.href = "/Dashboard"}>
            Sign up
          </button>
        </div>
      </div>

      <div className={styles.Hero_section}>
        <div className={styles.content}>
          <h1>Let your data chat with customers for free</h1>
          <span>
            Make a custom chatbot in seconds with your own PDFs, text and get a
            shareable link and use the chatbot anywhere you want
          </span>
          <button onClick={() => window.location.href = "/Dashboard"}>
            Create for free
          </button>
        </div>

        <div className={styles.Steps_wrapper}>
          <img src={Hero} alt="Hero section" />
        </div>
      </div>

      <footer className={styles.Footer}>
        <div className={styles.Footer_inner}>
          <div className={styles.Footer_brand}>
            <div className={styles.Footer_logo}>
              Lunaar <SendHorizonal size={14} />
            </div>
            <p className={styles.Footer_tagline}>
              Turn documents into chatbots, instantly.
            </p>
          </div>

          <div className={styles.Footer_links}>
            <a href="/Dashboard" className={styles.Footer_link}>Dashboard</a>
            <span className={styles.Footer_divider}>·</span>
            <a href="/privacy" className={styles.Footer_link}>Privacy Policy</a>
            <span className={styles.Footer_divider}>·</span>
            <a href="/Terms" className={styles.Footer_link}>Terms & Conditions</a>
          </div>

          <p className={styles.Footer_copy}>
            © {new Date().getFullYear()} Lunaar. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
