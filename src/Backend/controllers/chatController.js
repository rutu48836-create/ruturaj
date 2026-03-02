
import {supabase} from "../config/supabaseClient.js"
import express from 'express'
import cors from 'cors'
import {scrapeWebsite} from "../services/website_data.js"

const app = express()

app.use(express.json())
app.use(cors())


export const Chat_handler = async(req,res) => {

const {message,shareToken,userId} = req.body
console.log(message)

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
You are ${chatbot.name}, a friendly and professional AI assistant.

PERSONALITY:
- Speak like a helpful human, not a robot.
- Keep responses short, clear, and natural.
- Avoid long paragraphs.
- Be conversational and polite.
- Sound confident but not overly formal.

KNOWLEDGE RULES:
You have access to the chatbot's knowledge base below.
This includes scraped website data and uploaded documents.

${chatbotContext}

INSTRUCTIONS:
- Answer ONLY using the information provided above.
- If needed, search carefully within the provided website content before answering.
- Do NOT make up information.
- If the answer is not found in the knowledge provided, say:
  "I don't have that information right now."

RESPONSE STYLE:
- Keep answers concise (3–6 sentences max).
- Use bullet points if helpful.
- Avoid repeating the question.
- If appropriate, guide the user to the relevant section of the website.

Your goal is to be helpful, clear, and human-like.
`;

 console.log(`chat bot name ${chatbot.name}`)
 

const { data: usageAllowed, error: usageError } = await supabase
	.from("users")
	 .select("monthly_message_count,monthly_message_limit")
     .eq("id", userId)
      .single();

	
if (error) {
  console.log(error);
  return;
}

	if(data.monthly_message_count >= data.monthly_message_limit){
  return res.status(403).json({ error: "limit reached" })
	}

	const newCount = (data.monthly_message_count || 0) + 1;

await supabase
  .from("users")
  .update({ monthly_message_count: newCount })
  .eq("id", userId);

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
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),

}
	);

	if (!response.ok) {
  const errorText = await response.text()
  console.error("Groq API error:", errorText)
  return res.status(500).json({ error: "AI provider failed" })
}

const aiData = await response.json()


return res.json({
  reply: data.choices?.[0]?.message?.content || "No response"
});

}catch(error){
  console.error("SERVER ERROR:", error);
    return res.status(500).json({ error: "Internal server error" });

}

}



