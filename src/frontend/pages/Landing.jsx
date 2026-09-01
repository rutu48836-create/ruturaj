
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/landing.module.css";
import { Telescope, Flame, Terminal, MessagesSquare, Trophy, BookOpen } from "lucide-react";
import comet_normal from "../assets/comet_normal.png";

const SUBJECTS = ["Python", "Spanish", "French Revolution", "Guitar chords", "Organic chemistry", "UI design", "The Roman Empire", "SQL"];

const FEATURES = [
  {
    icon: BookOpen,
    title: "A course built around your question",
    text: "Type what you want to learn, in your own words. Lunaar breaks it into lessons, examples and checks sized for the topic, not a generic template.",
  },
  {
    icon: Terminal,
    title: "Practice where practice belongs",
    text: "Some topics need typing, not multiple choice. Command-line lessons run in a real terminal simulator, so muscle memory forms before the quiz does.",
  },
  {
    icon: MessagesSquare,
    title: "Conversations, not flashcards",
    text: "Language lessons play out as a back-and-forth with a character in the scenario, with the translation a tap away when you need it.",
  },
  {
    icon: Trophy,
    title: "A boss challenge, not just a final score",
    text: "Every course ends with a mixed set of questions pulled from what you covered, so finishing means you've actually retained it.",
  },
];

export function Landing() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");

  const start = () => {
    navigate(prompt.trim() ? `/?prompt=${encodeURIComponent(prompt.trim())}` : "/Dashboard");
  };

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <img src={comet_normal} width={28} height={28} alt="" />
          <span>Lunaar</span>
        </div>
        <div className={styles.nav_links}>
          <a href="/terms">Terms & conditions</a>
          <a href="/privacy">Privacy policy</a>
          <a href="#subjects">Subjects</a>
        </div>
        <button type="button" className={styles.nav_cta} onClick={() => navigate("/auth")}>
          Log in
        </button>
      </nav>

      <header className={styles.hero}>
        <svg className={styles.comet_trail} viewBox="0 0 520 160" aria-hidden="true">
          <path d="M10 150 C 140 120, 260 40, 500 12" />
          <circle cx="500" cy="12" r="5" />
        </svg>

        <div className={styles.hero_inner}>
          <h1>
            Say what you want to learn.
            <br />
            Lunaar builds the course.
          </h1>
          <p className={styles.hero_sub}>
            No catalog to browse and no syllabus to pick. Describe the topic, and get lessons,
            practice and a final challenge built specifically for it.
          </p>

          <div className={styles.prompt_box}>
            <textarea
              placeholder="Teach me about the french revolution"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
            />
            <button type="button" onClick={start}>
              Start course
            </button>
          </div>

          <div className={styles.hero_chips}>
            {["Python", "Spanish", "French Revolution", "The Roman Empire"].map((s) => (
              <button type="button" key={s} onClick={() => setPrompt(`Teach me ${s.toLowerCase()}`)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className={styles.how} id="how">
        <h2>How a course comes together</h2>
        <ol className={styles.how_list}>
          <li>
            <span className={styles.how_num}>01</span>
            <h3>Ask</h3>
            <p>Type what you're trying to understand, as specific or as broad as you like.</p>
          </li>
          <li>
            <span className={styles.how_num}>02</span>
            <h3>Learn</h3>
            <p>Work through lessons, worked examples and short checks, in an order that builds on itself.</p>
          </li>
          <li>
            <span className={styles.how_num}>03</span>
            <h3>Track</h3>
            <p>Progress is saved lesson by lesson, and a daily streak keeps you coming back to finish it.</p>
          </li>
        </ol>
      </section>

      <section className={styles.features} id="lessons">
        <h2>Lessons that match the subject</h2>
        <div className={styles.feature_grid}>
          {FEATURES.map((f) => (
            <div className={styles.feature} key={f.title}>
              <f.icon size={22} strokeWidth={1.6} />
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.subjects} id="subjects">
        <h2>Learn anything you can describe</h2>
        <div className={styles.subject_row}>
          {SUBJECTS.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </section>

      <section className={styles.streak}>
        <div className={styles.streak_number}>
          <Flame size={28} strokeWidth={1.8} />
          14
        </div>
        <div className={styles.streak_text}>
          <h2>Miss a day and the count resets</h2>
          <p>
            A streak only tracks whether you showed up. It doesn't grade you, judge the topic, or
            care how long the session was — just that you kept going.
          </p>
        </div>
      </section>

      <section className={styles.cta}>
        <Telescope size={30} strokeWidth={1.6} />
        <h2>Start your first course</h2>
        <p>Takes about as long as typing a sentence.</p>
        <button type="button" onClick={() => navigate("/signup")}>
          Create an account
        </button>
      </section>

      <footer className={styles.footer}>
        <div className={styles.logo}>
          <img src={comet_normal} width={20} height={20} alt="" />
          <span>Lunaar</span>
        </div>
        <div className={styles.footer_links}>
          <a href="#how">How it works</a>
          <a href="#lessons">Lessons</a>
          <a href="#subjects">Subjects</a>
        </div>
        <span className={styles.footer_copy}>© {new Date().getFullYear()} Lunaar</span>
      </footer>
    </div>
  );
}