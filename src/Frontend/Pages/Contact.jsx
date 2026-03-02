import { useState } from "react";
import { NavBar } from "../Components/NavBar";
import styles from "../Styles/Terms.module.css"

export function Contact(){

return(

    <div className={styles.Terms_wrapper}>

    <NavBar/>
    <div className={styles.Terms_content}>

      <h1>Contact Us</h1>

      <span>📬 We'd love to hear from you! Reach out to us anytime and we'll get back to you as soon as possible.</span>

      <span>Email Support

For general inquiries, feedback, or support requests, you can reach us at:
📧 LunaarOffical@gmail.com

We aim to respond within 24–48 hours on business days.
Please include a clear subject line so we can assist you faster.
For bug reports, kindly describe the issue in detail along with your device and browser info.</span>

      <span>Business & Collaboration

Interested in partnering with Lunaar or have a business proposal?
📩 Reach us at: LunaarOffical@gmail.com

We welcome collaborations, sponsorships, and integration opportunities.
Our team will review your message and respond within 3–5 business days.</span>

      <span>Beta Feedback

Lunaar is currently in beta and your feedback helps us improve.
💡 Share your thoughts, suggestions, or feature requests at:
LunaarOffical@gmail.com

Every piece of feedback is reviewed by our development team.
Help us shape the future of Lunaar by telling us what you love or what needs improvement.</span>

    </div>

    </div>

)

}