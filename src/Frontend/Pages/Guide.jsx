import { NavBar } from "../Components/NavBar";
import styles from "../Styles/Guide.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";

const agents = [
  {
    id: "info",
    tag: "Info Agent",
    tagColor: "#2563eb",
    tagBg: "#eff6ff",
    headline: "Knowledge base, answered instantly.",
    description:
      "Train an AI on your content — PDFs, documents, or a custom prompt — and let it answer questions on your behalf. Perfect for FAQs, documentation, study guides, or any situation where you want people to get answers fast.",
    useCases: ["Customer support FAQ", "Product documentation", "Study assistant", "Knowledge base"],
    steps: [
      {
        number: "01",
        title: "Upload a logo",
        body: "A square image under 4MB. This appears in the chat header so visitors know who they're talking to.",
      },
      {
        number: "02",
        title: "Give it a name",
        body: 'Name your agent something clear and on-brand — like "Acme Support" or "Study Bot".',
      },
      {
        number: "03",
        title: "Write a system prompt",
        body: 'Describe what the agent should do. Example: "You are a helpful assistant for Acme Co. Answer questions about our products using only the knowledge base provided."',
      },
      {
        number: "04",
        title: "Upload a PDF or paste content",
        body: "Upload your product catalogue, documentation, or any PDF. The agent learns from this content and only answers based on it.",
      },
    ],
    note: null,
  },
  {
    id: "sales",
    tag: "Sales Agent",
    tagColor: "#059669",
    tagBg: "#ecfdf5",
    headline: "Take orders directly from chat.",
    description:
      "Let customers browse, ask questions, and place orders — all inside the chat. The agent collects name, phone, address, product, and payment method, then emails you the full order details instantly.",
    useCases: ["Online stores", "Local businesses", "Food & beverage", "Handmade / custom products"],
    steps: [
      {
        number: "01",
        title: "Upload a logo, name & system prompt",
        body: 'Required for all agents. In the prompt, describe your business and any rules — e.g. "Only sell from the catalogue. Never make up prices."',
      },
      {
        number: "02",
        title: "Upload your product catalogue",
        body: "Upload a PDF of your products, prices, and variants. The agent uses this to answer product questions and confirm order details.",
      },
      {
        number: "03",
        title: "Add your notification email",
        body: "Every completed order gets emailed to you with the customer's full details — name, phone, address, product, and payment method.",
      },
      {
        number: "04",
        title: "Share your chatbot link",
        body: "Customers chat, place orders, and you get notified. No checkout page needed.",
      },
    ],
    note: "The agent will never confirm an order until all 5 details are collected. If a customer skips something, the agent politely asks again.",
  },
  {
    id: "assistant",
    tag: "Assistant Agent",
    tagColor: "#7c3aed",
    tagBg: "#f5f3ff",
    headline: "Bookings & reservations, on autopilot.",
    description:
      "Let people request meetings, restaurant reservations, or appointments through chat. The agent collects their details, checks your Google Calendar for availability, and notifies you for approval. You confirm or cancel with one click — and the booking lands on your calendar automatically.",
    useCases: ["Restaurants & cafés", "Consultants & freelancers", "Clinics & salons", "Meeting scheduling"],
    steps: [
      {
        number: "01",
        title: "Upload a logo, name & system prompt",
        body: 'Required for all agents. In your prompt, describe what extra info you need — e.g. "Also ask for number of guests and any dietary requirements."',
      },
      {
        number: "02",
        title: "Add your notification email",
        body: "When a booking request comes in, you'll get an email with all the customer's details and two buttons — Confirm or Cancel.",
      },
      {
        number: "03",
        title: "Create the agent, then connect Google Calendar",
        body: "After creating the agent, a Connect Google Calendar button appears on your dashboard card. Click it, sign in with Google, and grant calendar access.",
      },
      {
        number: "04",
        title: "Approve bookings with one click",
        body: "You get an email for every request. Click Confirm — the event is added to your Google Calendar and the customer gets a confirmation email automatically.",
      },
    ],
    note: "Bookings are never added to your calendar without your approval. You stay in full control.",
  },
];

function AgentSection({ agent, index }) {
  const [open, setOpen] = useState(null);
  const isEven = index % 2 === 0;

  return (
    <section className={`${styles.agent_section} ${isEven ? styles.even : styles.odd}`} id={agent.id}>
      <div className={styles.agent_inner}>

        <div className={styles.agent_left}>
          <span className={styles.agent_tag} style={{ color: agent.tagColor, background: agent.tagBg }}>
            {agent.tag}
          </span>
          <h2 className={styles.agent_headline}>{agent.headline}</h2>
          <p className={styles.agent_description}>{agent.description}</p>

          <div className={styles.use_cases}>
            <span className={styles.use_cases_label}>Best for</span>
            <div className={styles.use_cases_list}>
              {agent.useCases.map((u) => (
                <span key={u} className={styles.use_case_pill}>{u}</span>
              ))}
            </div>
          </div>

          {agent.note && (
            <div className={styles.agent_note}>
              <span className={styles.note_icon}>💡</span>
              <span>{agent.note}</span>
            </div>
          )}
        </div>

        <div className={styles.agent_right}>
          <div className={styles.steps_card}>
            <div className={styles.steps_card_header}>
              <span>Setup guide</span>
              <span className={styles.steps_count}>{agent.steps.length} steps</span>
            </div>
            <div className={styles.steps_list}>
              {agent.steps.map((step, i) => (
                <div
                  key={i}
                  className={`${styles.step_item} ${open === i ? styles.step_open : ''}`}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <div className={styles.step_header}>
                    <span className={styles.step_number} style={{ color: agent.tagColor }}>{step.number}</span>
                    <span className={styles.step_title}>{step.title}</span>
                    <span className={styles.step_chevron}>{open === i ? '−' : '+'}</span>
                  </div>
                  {open === i && (
                    <div className={styles.step_body}>{step.body}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export function Guide() {
  return (
    <div className={styles.guide_wrapper}>
      <NavBar />

      <div className={styles.guide_content}>

        {/* Hero */}
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Agent setup guide</span>
          <h1>Three agents. Endless possibilities.</h1>
          <p>
            Lunaar gives you three types of AI agents — each built for a different job.
            Pick the one that fits your use case, follow the setup steps, and go live in minutes.
          </p>
          <div className={styles.hero_nav}>
            <a href="#info" className={styles.hero_nav_btn} style={{ borderColor: '#2563eb', color: '#2563eb' }}>Info Agent</a>
            <a href="#sales" className={styles.hero_nav_btn} style={{ borderColor: '#059669', color: '#059669' }}>Sales Agent</a>
            <a href="#assistant" className={styles.hero_nav_btn} style={{ borderColor: '#7c3aed', color: '#7c3aed' }}>Assistant Agent</a>
          </div>
        </section>

        {/* Common requirements */}
        <section className={styles.common_section}>
          <div className={styles.common_inner}>
            <span className={styles.common_label}>Required for all agents</span>
            <div className={styles.common_items}>
              <div className={styles.common_item}>
                <span className={styles.common_icon}>🖼️</span>
                <div>
                  <strong>Logo</strong>
                  <span>Square image, under 4MB. Shown in the chat header.</span>
                </div>
              </div>
              <div className={styles.common_item}>
                <span className={styles.common_icon}>✏️</span>
                <div>
                  <strong>Agent name</strong>
                  <span>What your chatbot is called. Keep it short and clear.</span>
                </div>
              </div>
              <div className={styles.common_item}>
                <span className={styles.common_icon}>⚙️</span>
                <div>
                  <strong>System prompt</strong>
                  <span>Instructions that define how the agent behaves and what it can answer.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.divider} />

        {/* Agent sections */}
        {agents.map((agent, i) => (
          <AgentSection key={agent.id} agent={agent} index={i} />
        ))}

        <div className={styles.divider} />

        {/* CTA */}
        <section className={styles.cta_section}>
          <h2>Ready to build your agent?</h2>
          <p>Create your first AI agent for free — no code, no credit card.</p>
          <Link to="/Dashboard" className={styles.cta_btn}>Start building →</Link>
        </section>

      </div>
    </div>
  );
}