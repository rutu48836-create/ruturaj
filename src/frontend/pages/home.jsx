import { useState } from "react";
import styles from "../styles/home.module.css"
import { ArrowUp,Sofa } from 'lucide-react';
import { Nav } from "../compoents/nav";
import { useAuth } from "../compoents/authcontext";
import { Top_nav } from "../compoents/nav";
import {useNavigate} from "react-router-dom"
import comet_normal from "../assets/comet_normal.png"

export function Home(){

 const [message, setMessage] = useState('')
 const [waiting,setWaiting] = useState(false)
 const { user, loading } = useAuth()
 const [sidebar_active, setSidebar_active] = useState(false);
 const navigate = useNavigate()

useEffect(() => {
  if(!user && !loading) {
  navigate('/auth')
 }
},[user,loading])


 const send_message = async () => {
  if (!message.trim()) return;
  if(waiting) return alert('pls wait');

    const learning_keywords = ['teach', 'explain', 'learn', 'how to', 'what is', 'course on', 'guide to'];
  const looks_like_request = learning_keywords.some(k => message.toLowerCase().includes(k));

  if (!looks_like_request) {
    return alert('Try phrasing it like "Teach me about..." or "Explain..."');
  }


  try {
    setWaiting(true)
    const request = await fetch(`${import.meta.env.VITE_BACKEND_KEY}/llm/create_lessons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ message,user_id:user.id })
    })
    const data = await request.json()
    setWaiting(false)
    navigate('/courses')
  } catch (err) {
    console.error('Failed to generate course:', err)
    setWaiting(false)
  }
 }

    return(
        <div className={styles.home_container}>
            <Nav sidebar_active={sidebar_active} setSidebar_active={setSidebar_active}/>
           <div className={styles.hero_wrapper}>
            <Top_nav setSidebar_active={setSidebar_active} sidebar_active={sidebar_active}/>
            <img src={comet_normal} width={100} height={100} className={styles.comet_img}/>
            <h1>
               What should we learn?
            </h1>

            <div className={styles.hero_wrapper_textarea}>
<textarea 
  placeholder="Teach me about french revolution"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
/>
<div className={styles.textarea_btns}>
    <button type="button" onClick={() => send_message()} disabled={waiting}><ArrowUp color="white"/></button>
</div>
            </div>

            <div className={styles.btns}>
              <button onClick={() => setMessage("teach me python")}>Code</button>
              <button onClick={() => setMessage("teach me Spanish")}>Spanish</button>
              <button onClick={() => setMessage("teach me about the french revolution")}>French Revolution</button>
              <button onClick={() => setMessage("teach me about India")}>India</button>
            </div>
           </div>

         {waiting && 
         
         <div className={styles.waiting_wrapper}>
            <h2>Please Wait... while we generate your course</h2>
            <p>you will be redirected once the course is generated.it may take upto 2 mins</p>
             <Sofa size={100}/>
          </div>
         
         }

        </div>
    )

}