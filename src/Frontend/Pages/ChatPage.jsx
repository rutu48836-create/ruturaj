import { useParams } from "react-router-dom"
import { useEffect, useState,useRef} from "react"
import { supabase } from "../config/supabaseClient"
import styles from "../Styles/ChatPage.module.css"
import { MoveUp, SendHorizontal, RefreshCw, Share } from 'lucide-react';

export function ChatPage() {
    const { shareToken } = useParams()
    const [chatbot, setChatbot] = useState(null)
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const messagesEndRef = useRef(null)
    const historyRef = useRef([])


    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
    }, [shareToken])

    const handle_copy = async () => {
        try {
            const shareLink = `${window.location.origin}/chat/${shareToken}`;
            await navigator.clipboard.writeText(shareLink)
            alert('Link copied!!')
        } catch (err) {
            console.log(err)
        }
    }

    const sendMessage = async () => {
          
        if (!message.trim()) return

        const userMessage = { role: "user", content: message }
historyRef.current.push({ role: 'user', content: message })
        setMessages(prev => [...prev, userMessage])
        setMessage("")

        const res = await fetch(`${BACKEND_URL}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ shareToken, message,history:historyRef.current})
        })

        const data = await res.json()
  historyRef.current.push({ role: 'assistant', content: data.reply })
        const botMessage = { role: "assistant", content: data.reply }
        setMessages(prev => [...prev, botMessage])
    }

function getTextColor(bgColor) {
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#ffffff';
}

    if (!chatbot) return <div>cannot find the chatbot... please wait a few secondes</div>

    const userMessageStyle = {
        padding: '.6rem .9rem',
        borderRadius: '20px',
        maxWidth: '60%',
        wordWrap: 'break-word',
        display: 'flex',
        alignSelf: 'flex-end',
        marginRight: '20px',
           backgroundColor:'#ebe5e5',
        color: '#202020',
        boxShadow: ` rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px`,
    }

    return (
        <div className={styles.ChatPage_wrapper} style={{color : getTextColor(chatbot.color)}}>
            <div className={styles.ChatPage_header}  style={{
    backgroundColor: `${chatbot.color || '#000'}90`,
    boxShadow: `inset 0 1px 0 rgba(236, 230, 230, 0.87), 0 4px 12px ${chatbot.color || '#000'}10`,
    color : getTextColor(chatbot.color)
  }}>
                <div className={styles.header_right}>
                    {chatbot.logo_url && <img src={chatbot.logo_url} alt="Logo" className={styles.Chat_bot_logo} />}
                    <h2>{chatbot.name}</h2>
                </div>
                <div className={styles.btn_wrapper_head}>
                    <button onClick={() => window.location.reload()}><RefreshCw size={18} style={{color:getTextColor(chatbot.color)}}/></button>
                    <button onClick={handle_copy}><Share size={18} style={{color:getTextColor(chatbot.color)}}/></button>
                </div>
            </div>

            <div className={styles.Chat_bot_message_container} style={{color : getTextColor(chatbot.color)}}>
                
                <div style={{ ...userMessageStyle, alignSelf: 'flex-start', marginLeft: '20px', backgroundColor:chatbot.color, color: '#ffffff' }}>
                    Hi, I am {chatbot.name}. How can I help you?
                </div>

                {messages.map((msg, i) => (
                    <div key={i} className={styles.message_row} style={{ display: 'flex', justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: '10px'}}>
                        <div style={msg.role === "user" ? userMessageStyle : { ...userMessageStyle, backgroundColor:chatbot.color, color: '#ebebeb', alignSelf: 'flex-start', marginLeft: '20px',   
}}>
                            {msg.content}
                        </div>
                    </div>
                ))}

           

                <div className={styles.Chat_bot_input_wrapper}>
                    <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Powered by Lunaar" />
                    <button onClick={sendMessage}   style={{
    backgroundColor: chatbot.color || '#000',
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 12px ${chatbot.color || '#000'}40`
  }}>
                        <SendHorizontal size={20} color="#fff" />
                    </button>
                </div>
            </div>
            </div>
        
    )
}
