
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../config/supabaseClient"
import styles from "../Styles/ChatPage.module.css"
import { Move, MoveUp } from 'lucide-react';

export function ChatPage(){

  const { shareToken } = useParams()
  const [chatbot,setChatbot] = useState(null)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])

       const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://localhost:5000"

   useEffect(() => {

   async function ChatBots() {

    
   const { data, error } = await supabase
        .from("chatbots")
        .select("*")
        .eq("share_token", shareToken)
        .single()

      if (!error) {
        setChatbot(data)
      }

   }

   ChatBots()

   },[shareToken])
  
const sendMessage = async () => {
    if (!message.trim()) return

    const userMessage = { role: "user", content: message }
    setMessages(prev => [...prev, userMessage])
    setMessage("")

    const res = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shareToken,
        message
      })
    })

    const data = await res.json()

    const botMessage = { role: "assistant", content: data.reply }
    setMessages(prev => [...prev, botMessage])
  }

  if (!chatbot) return <div>Loading chatbot...</div>



  return(

 <>
 
 <div className={styles.ChatPage_wrapper}>

<div className={styles.ChatPage_header}>
     {chatbot.logo_url && (
      <img
        src={chatbot.logo_url}
        alt="Chatbot Logo"
        className={styles.Chat_bot_logo}
      />
    )}
    <h2>{chatbot.name}</h2>
</div>

 <div className={styles.Chat_bot_message_container}>

{messages.map((msg, i) => (
  <div
    key={i}
    className={styles.message_row}
    style={{
      justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
    }}
  >
     <div className={msg.role === "assistant" ? styles.chatbot_container: styles.message_box }>
      {msg.content} 
    </div>
  </div>
))}

 <div className={styles.Chat_bot_input_wrapper}>

 <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask something"/>
 <button onClick={sendMessage}><MoveUp size={16}/></button>


 </div>

 </div>

 </div>
 
 
 
 </>


  )

}