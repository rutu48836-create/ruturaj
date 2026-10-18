import styles from "../styles/landing.module.css"
import {
  ArrowRight,
  Bot,
  Brain,
  Check,
  Code,
  Globe,
  Key,
  MessageSquare,
  Palette,
  Plug,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react"

const BUILDER_URL = "/builder"

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "BYOK", href: "#byok" },
  { label: "FAQ", href: "#faq" },
]

const FEATURES = [
  {
    icon: Brain,
    title: "Trained on your content",
    text: "Feed your bot docs, FAQs and product info so it answers like someone who actually knows your business.",
  },
  {
    icon: Palette,
    title: "Your brand, your voice",
    text: "Set the name, personality, tone and colors. Make it friendly, formal or playful in a few clicks.",
  },
  {
    icon: Code,
    title: "Embed anywhere",
    text: "Drop a single snippet into any website, React app or landing page and your bot is live.",
  },
  {
    icon: Plug,
    title: "Pick your model",
    text: "Connect the AI provider you prefer with your own API key and switch models whenever you want.",
  },
  {
    icon: MessageSquare,
    title: "Real conversations",
    text: "Bots keep context across a chat, handle follow-ups and stay on topic instead of repeating canned replies.",
  },
  {
    icon: Globe,
    title: "Works on every screen",
    text: "A fast, responsive chat widget that feels native on desktop, tablet and mobile.",
  },
]

const STEPS = [
  {
    title: "Add your API key",
    text: "Paste the key from your AI provider. You stay in control of usage and spend.",
  },
  {
    title: "Build your bot",
    text: "Name it, write its instructions, add your knowledge and preview it live.",
  },
  {
    title: "Embed and go live",
    text: "Copy the snippet, paste it into your site, and your bot starts answering.",
  },
]

const BYOK_POINTS = [
  "Lunaar is completely free, no plans, no tiers, no trial",
  "You pay your AI provider directly at their own rates",
  "Zero markup on tokens or messages",
  "No account needed to get started",
]

const FAQS = [
  {
    q: "Is Lunaar really free?",
    a: "Yes. Building and running bots on Lunaar costs nothing. The only cost is what your AI provider charges for your own API usage, and many providers offer generous free tiers.",
  },
  {
    q: "What does BYOK mean?",
    a: "Bring Your Own Key. You connect your own API key from an AI provider, so you decide which model powers your bot and you pay that provider directly.",
  },
  {
    q: "Do I need to sign up?",
    a: "No. There is no sign up or login step. Open the builder and start creating your bot.",
  },
  {
    q: "Where can I put my bot?",
    a: "Anywhere you can add a script or a component: websites, web apps, landing pages and storefronts.",
  },
  {
    q: "Can I customize how my bot behaves?",
    a: "Absolutely. You define its name, personality, instructions and the knowledge it should rely on.",
  },
]

function Nav() {
  return (
    <header className={styles.nav}>
      <a href="#top" className={styles.brand}>
        <span className={styles.brand_mark}>
          <Bot size={18} />
        </span>
        Lunaar
      </a>
      <nav className={styles.nav_links}>
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>
      <a href={BUILDER_URL} className={styles.nav_cta}>
        Build a bot
        <ArrowRight size={15} />
      </a>
    </header>
  )
}

function ChatPreview() {
  return (
    <div className={styles.chat}>
      <div className={styles.chat_head}>
        <span className={styles.chat_avatar}>
          <Bot size={16} />
        </span>
        <div>
          <strong>Luna</strong>
          <small>
            <i /> Online
          </small>
        </div>
      </div>
      <div className={styles.chat_body}>
        <p className={`${styles.msg} ${styles.msg_bot}`}>
          Hi! I'm Luna. Ask me anything about our products, pricing or shipping.
        </p>
        <p className={`${styles.msg} ${styles.msg_user}`}>
          Do you ship internationally?
        </p>
        <p className={`${styles.msg} ${styles.msg_bot}`}>
          Yes, we ship to 40+ countries. Delivery usually takes 5 to 9 business days.
        </p>
        <div className={`${styles.msg} ${styles.msg_bot} ${styles.typing}`}>
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className={styles.chat_input}>
        <span>Type a message...</span>
        <ArrowRight size={16} />
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section id="top" className={styles.hero}>
      <div className={styles.hero_text}>
        <span className={styles.pill}>
          <Sparkles size={14} />
          Free forever &middot; Bring your own key
        </span>
        <h1>
          Build AI chatbots <br />
          <em>without the bill.</em>
        </h1>
        <p>
          Lunaar bots answer your customers, explain your product and run on your website
          around the clock. Plug in your own API key and launch in minutes. No sign up, no
          subscription.
        </p>
        <div className={styles.hero_actions}>
          <a href={BUILDER_URL} className={styles.btn_primary}>
            Start building
            <ArrowRight size={16} />
          </a>
          <a href="#features" className={styles.btn_ghost}>
            See what bots can do
          </a>
        </div>
        <ul className={styles.hero_badges}>
          <li>
            <Check size={14} /> 100% free
          </li>
          <li>
            <Check size={14} /> BYOK
          </li>
          <li>
            <Check size={14} /> No account needed
          </li>
        </ul>
      </div>
      <div className={styles.hero_visual}>
        <div className={styles.glow} />
        <ChatPreview />
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section className={styles.stats}>
      <div>
        <strong>$0</strong>
        <span>platform cost</span>
      </div>
      <div>
        <strong>1 key</strong>
        <span>is all you need</span>
      </div>
      <div>
        <strong>2 min</strong>
        <span>to your first bot</span>
      </div>
      <div>
        <strong>0</strong>
        <span>sign ups required</span>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="features" className={styles.section}>
      <div className={styles.section_head}>
        <span className={styles.eyebrow}>What bots can do</span>
        <h2>Everything you need to put a smart assistant on your site</h2>
        <p>Simple to set up, flexible enough to fit any business.</p>
      </div>
      <div className={styles.feature_grid}>
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <article key={title} className={styles.card}>
            <span className={styles.card_icon}>
              <Icon size={20} />
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function How() {
  return (
    <section id="how" className={styles.section}>
      <div className={styles.section_head}>
        <span className={styles.eyebrow}>How it works</span>
        <h2>From idea to live bot in three steps</h2>
      </div>
      <div className={styles.steps}>
        {STEPS.map((s, i) => (
          <div key={s.title} className={styles.step}>
            <span className={styles.step_num}>0{i + 1}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </div>
        ))}
      </div>
      <div className={styles.code}>
        <div className={styles.code_bar}>
          <i />
          <i />
          <i />
          <span>index.html</span>
        </div>
        <pre>
          <code>{`<script
  src="https://lunaar.online/widget.js"
  data-bot-id="YOUR_BOT_ID"
  defer
></script>`}</code>
        </pre>
      </div>
    </section>
  )
}

function Byok() {
  return (
    <section id="byok" className={styles.section}>
      <div className={styles.byok}>
        <div className={styles.byok_text}>
          <span className={styles.eyebrow}>BYOK &middot; Free</span>
          <h2>Your key. Your model. Your costs.</h2>
          <p>
            Most chatbot platforms charge you per message on top of what the AI costs. Lunaar
            skips the middleman. Bring your own API key, and pay only your provider's rates,
            nothing extra to us.
          </p>
          <ul>
            {BYOK_POINTS.map((p) => (
              <li key={p}>
                <span>
                  <Check size={14} />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <a href={BUILDER_URL} className={styles.btn_primary}>
            Add your key and start
            <ArrowRight size={16} />
          </a>
        </div>
        <div className={styles.byok_visual}>
          <div className={styles.key_card}>
            <div className={styles.key_row}>
              <Key size={18} />
              <span>API key</span>
              <em>connected</em>
            </div>
            <div className={styles.key_value}>sk-••••••••••••••••••••3f9a</div>
            <div className={styles.key_meta}>
              <ShieldCheck size={14} />
              Billed by your provider, not by Lunaar
            </div>
          </div>
          <div className={styles.key_card}>
            <div className={styles.key_row}>
              <Zap size={18} />
              <span>Platform fee</span>
              <em>$0.00</em>
            </div>
            <div className={styles.key_meta}>No tiers. No limits on bots we charge for.</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section id="faq" className={styles.section}>
      <div className={styles.section_head}>
        <span className={styles.eyebrow}>FAQ</span>
        <h2>Questions, answered</h2>
      </div>
      <div className={styles.faq}>
        {FAQS.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function Cta() {
  return (
    <section className={styles.cta}>
      <h2>Ready to meet your new support team?</h2>
      <p>Build your first Lunaar bot now. It's free and it takes minutes.</p>
      <a href={BUILDER_URL} className={styles.btn_primary}>
        Build my bot
        <ArrowRight size={16} />
      </a>
    </section>
  )
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.brand}>
        <span className={styles.brand_mark}>
          <Bot size={16} />
        </span>
        Lunaar
      </span>
      <small>&copy; {new Date().getFullYear()} Lunaar. Free and BYOK.</small>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Features />
        <How />
        <Byok />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}
