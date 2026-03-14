
import {useState} from "react";
import styles from "../Styles/Homepage.module.css"
import { SendHorizonal } from "lucide-react";
import No_agent from "../assets/No_agent.png"

 export function Homepage(){
 
    return(

<div className={styles.Homepage_wrapper}>

<div className={styles.Navbar}>

<div className={styles.logo}>Lunaar <SendHorizonal size={18}/></div>
<div className={styles.Nav_btns}>
    <button className={styles.login_btn}>Log in</button>
    <button className={styles.sign_up}>Sign up</button>
</div>
</div>

<div className={styles.Hero_section}>

    <div className={styles.content}>

<h1>Turn Boring Documents Into Helpful Chatbots</h1>
<span>Make a custom chatbot in seconds with your own pdfs,text and get a sharable link and use the chatbot anywhere you want</span>

<button>Create for free</button>
</div>
<div className={styles.Img_wrapper}><img src={No_agent} alt="hero image"/></div>

</div>

</div>


    )




 }
