
import {supabase} from "../config/supabaseClient.js"
import express from 'express'
import cors from 'cors'
import {scrapeWebsite} from "../services/website_data.js"
import { sendNotifications } from "../services/email.js"

const app = express()

app.use(express.json())
app.use(cors())


export const Chat_handler = async(req,res) => {

const {message,shareToken,agentType,notificationEmail,history} = req.body

let conversationHistory = []

try{


if(!message || !shareToken){
    return console.log('NO MESSAGE OR SHARETOKEN')
}

 const { data: chatbot, error } = await supabase
      .from("chatbots")
      .select("*")
      .eq("share_token", shareToken)
      .single()

    if (error || !chatbot) {
      return res.status(404).json({ error: "Chatbot not found" })
    }

   const chatbotContext = Object.entries(chatbot)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

const systemPrompt = `
You are ${chatbot.name}, a friendly customer support assistant.

PERSONALITY:
- Warm, empathetic, and patient.
- Keep replies short, clear, and helpful.
- Never sound robotic or formal.
- Add one emoji per message to feel human 😊

KNOWLEDGE BASE:
${chatbotContext}

INSTRUCTIONS:
- Answer ONLY using the knowledge base above.
- If you don't know, say: "Let me check that — could you clarify what you need?"
- Never make up information.

RESPONSE STYLE:
- Max 40 words per reply.
- 1 to 3 sentences only.
- Be kind and solution-focused.

Your goal is to resolve issues quickly and leave the user feeling helped.
`

const salesPrompt = `
You are ${chatbot.name}, a friendly AI sales assistant.

PERSONALITY:
- Warm, conversational, and encouraging.
- Max 40 words per reply, 1-3 sentences.
- One emoji per message 😊

KNOWLEDGE BASE:
${chatbotContext}

INSTRUCTIONS:
- Answer ONLY using the knowledge base above.
- If a product/detail is not found, ask the user to clarify.
- Never make up prices or product details.

SALES FLOW:
When user wants to order, collect these ONE AT A TIME:
1. Full name
2. Phone number
3. Delivery address
4. Product & quantity
5. Payment method (Cash on Delivery / UPI / Card)

Then confirm each detail naturally before moving to the next.

ORDER CONFIRMATION:
Once ALL details are collected send:
"Perfect! Your order is confirmed, we'll be in touch soon 🎉"

Then add on a NEW LINE (internal use only, never show to user):
##ORDER_COMPLETE##
Name: [name]
Phone: [phone]
Address: [address]
Product: [product and quantity]
Payment: [payment method]
##END##

RULES:
- NEVER output ##ORDER_COMPLETE## until all details are confirmed.
- If user skips a detail, ask for it again politely.
`

const activePrompt = chatbot.agent_type === 'sales' ? salesPrompt : systemPrompt

console.log(activePrompt)

 console.log(`chat bot name ${chatbot.name}`)
 

const { error: usageError } = await supabase.rpc(
  "check_and_increment_message",
  { uid: chatbot.user_id } // this is Firebase UID (text)
);

if (usageError) {
  console.error("Usage RPC error:", usageError);
  return res.status(403).json({
    error: usageError.message
  });
}

conversationHistory.push({role:'user',content:message})

 const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
		{
			headers: {
				Authorization: `Bearer ${process.env.GROQ_TOKEN}`,
				"Content-Type": "application/json",
			},
			method: "POST",
		    body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
           
            { role: "system", content: activePrompt },
            ...history
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),

}
	);
	const data = await response.json();

        console.log("HF RAW:", data);

         const aiReply = data.choices?.[0]?.message?.content
         let orderDetails;

         if (chatbot.agent_type === 'sales' && aiReply.includes('##ORDER_COMPLETE##')) {
      const orderMatch = aiReply.match(/##ORDER_COMPLETE##([\s\S]*?)##END##/)
       orderDetails = orderMatch ? orderMatch[1].trim() : 'Details not captured'
      await sendNotifications(chatbot,message, aiReply, orderDetails)
      const cleanReply = aiReply.replace(/##ORDER_COMPLETE##[\s\S]*?##END##/, '').trim()
      return res.json({ reply: cleanReply })
    }

   
  /* const email =  await sendNotifications(chatbot, message, aiReply,orderDetails)
  console.log(email,"email") */
  




return res.json({
  reply: data.choices?.[0]?.message?.content || "No response"
});





}

catch(error){
  console.error("SERVER ERROR:", error);
    return res.status(500).json({ error: "Internal server error" });
  
  }

}
