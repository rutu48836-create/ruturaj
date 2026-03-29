import {supabase} from "../config/supabaseClient.js"
import express from 'express'
import cors from 'cors'
import {scrapeWebsite} from "../services/website_data.js"
import { sendNotifications } from "../services/email.js"
import { sendConfirmation } from "../services/email_assistant.js"
import {isSlotFree,getFreeSlots} from "../services/google_calender.js"

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

const assistantPrompt = `You are ${chatbot.name}, a friendly assistant for confirming meetings and reservations

PERSONALITY:
- Warm, conversational, and encouraging.
- Max 40 words per reply, 1-3 sentences.
- One emoji per message 😊

KNOWLEDGE BASE:
${chatbotContext}

Your job is to collect the following details naturally in conversation:

REQUIRED (always collect these):
1. Full name
2. Email address
3. Phone number
4. Preferred date and time (MUST be in format: YYYY-MM-DD HH:mm, e.g. 2026-03-28 15:00)

ADDITIONAL (collect these if mentioned in the knowledge base above, e.g. "number of people", "notes", "location", "service type" etc):
- Check the knowledge base for any extra fields the owner wants to collect
- If found, collect those too in the same conversation

RULES:
- Ask for one thing at a time naturally
- Until you have ALL required + additional details, keep chatting and asking for what's missing
- Once you have ALL details, respond with ONLY the raw JSON below — nothing else, no extra text
- DO NOT use markdown formatting or any conversational text in your final response

Output format:
{"collected": true, "name": "...", "email": "...", "phone": "...", "datetime": "...", "details": {"any_extra_field": "...", "another_field": "..."}}
`;

const activePrompt = chatbot.agent_type === 'sales' ? salesPrompt : systemPrompt
const finalPrompt = chatbot.agent_type == 'assistant' ? assistantPrompt : activePrompt

console.log(finalPrompt)


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
           
            { role: "system", content: finalPrompt },
            ...history
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),

}
	);

         let name;
         let datetime;
         let phone;

	const data = await response.json();



        console.log("HF RAW:", data);

         const aiReply = data.choices?.[0]?.message?.content

         console.log('RAW AI REPLY:', aiReply)
let replyToSend = aiReply;


if(chatbot.agent_type === 'assistant'){

try{

 const cleaned = aiReply
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)

if(jsonMatch){
  const parsed = JSON.parse(jsonMatch[0])

    if (parsed.collected === true) {
      console.log('=== ALL 3 DETAILS COLLECTED — SENDING EMAIL ===')
    
        const booking = {
          name: parsed.name,
          email: parsed.email,
          phone: parsed.phone,
          datetime: parsed.datetime,
          status: 'pending',
          details:parsed.details
        }

            const free = await isSlotFree(chatbot, booking.datetime)

         if(!free){
    const freeSlots = await getFreeSlots(chatbot, booking.datetime)
   replyToSend = `Sorry, that time slot is already booked! 😔 Here are some available times:\n\n${
        freeSlots.map((s, i) => `${i + 1}. ${s}`).join('\n')
      }\n\nWould any of these work for you?`
    }
else{

        const { bookingId } = await sendConfirmation(chatbot, booking)
      replyToSend = `Got it! Your booking request has been sent. The owner will confirm shortly. 🎉`
    


      console.log('Name:', name);
    console.log('Phone:', phone);
    console.log('Datetime:', datetime);
    console.log('PARSED:', parsed)

}
}
}
}
catch(error){

  console.log('error in sending email for confirmation',error)

}

  return res.json({ reply: replyToSend });

}


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