
import { useEffect, useState,useRef} from "react"
import styles from '../Styles/Pricing.module.css'
import { SendHorizonal,Check} from "lucide-react";
import { useNavigate } from "react-router-dom";


export function Pricing(){

     const navigate = useNavigate();
  

return (

    
    <div className={styles.Homepage_wrapper}>

      <div className={styles.Navbar}>
        <div className={styles.logo}>
          Lunaar <SendHorizonal size={18} />
        </div>
        <div className={styles.Nav_btns}>
          <button className={styles.login_btn} onClick={() => window.location.href = "/Dashboard"}>
            Log in
          </button>
          <button className={styles.sign_up} onClick={() => window.location.href = "/Dashboard"}>
            Sign up
          </button>
        </div>
      </div>
    
    <div className={styles.Pricing_wrapper}>

     <h1>Pricing & Plans</h1>
     <span>Choose the perfect plan for your needs.Upgrade anytime. Choose a plan according to your needs, explore and choose</span>

     <div className={styles.Pricing_cards_wrapper}>
        <div className={styles.Free_tier_card}>

            <h3>Free</h3>
            <div className={styles.pricing}>
                <h1>$0</h1><p>per month</p>
            </div>

            <span>Ideal for beginners and individuals who want to try out the platform</span>

            <div className={styles.features}>

             <h3>Free features:</h3>
             <ul>
             <li><Check size={16} />maximum 200 queries</li>
             <li><Check size={16} />create 2 chatbots</li>
             <li><Check size={16} />access to all agents</li>
             <li><Check size={16} />can train it by either link or pdfs</li>

             </ul>

                </div>

        </div>

        <div className={styles.Free_tier_card}>

            <h3>Pro</h3>
            <div className={styles.pricing}>
                <h1>$4.29</h1><p>per month</p>
            </div>

            <span>Ideal for business owners and looking for more advanced features</span>

            <button style={{background:"#000", color:"#fff"}} onClick={() => navigate('/Dashboard')}>Explore</button>

            <div className={styles.features}>

             <h3>Free features:</h3>
             <ul>
             <li><Check size={16} />maximum 1200 queries</li>
             <li><Check size={16} />create 5 chatbots</li>
             <li><Check size={16} />access to all agents</li>
             <li><Check size={16} />can train it with both a link or pdfs</li>

             </ul>

                </div>
                </div>
     </div>
        </div>
    
</div>
)


}
