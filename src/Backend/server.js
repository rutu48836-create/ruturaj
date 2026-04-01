import { supabase } from './config/supabaseClient.js'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import { Chat_handler } from './controllers/chatController.js'
import chatRoutes from "./routes/chat.js";
import {scrapeWebsite} from './services/website_data.js'
import { extractPDFText } from './services/pdf_data.js'
import {sendConfirmation,sendUserCancelled,sendUserConfirmed,pendingBookings} from "./services/email_assistant.js"
import { bookCalendarEvent } from './services/google_calender.js'
import { google } from 'googleapis' 
import paymentRoutes from "./routes/payment.js";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000

// Configure multer for file uploads (store in memory)
const storage = multer.memoryStorage()
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max
  }
})

app.use(cors())
app.use(express.json())

function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )
}

app.post('/api/create', 

  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'pdfs', maxCount: 10 }
  ]), 
  async (req, res) => {
    try {

const { website, name, systemPrompt, userId,color,agentType,notificationEmail} = req.body
console.log('=== DEBUG ===')
console.log('name:', name)
console.log('body:', req.body)


// Move cleanText BEFORE it's used
function cleanText(text) {
  if (!text) return ''
  return text
    .replace(/\s+/g, ' ')
    .replace(/(.)\1{3,}/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[^\w\s.,!?-]/g, '')
    .trim()
}

async function prepareScrapedContent(pages, maxTokens = 8000) {
  const maxChars = maxTokens * 4
  let result = ''

  for (const page of pages) {
    // ✅ use page.url not content_pages.url
    const chunk = `\n\n--- ${page.url} ---\n${page.text}`
    if ((result + chunk).length > maxChars) break
    result += chunk
  }

  return result
}



let content_pages;
let trimmed;


if(website){
  content_pages  = await scrapeWebsite(website, 12)
  const cleaned = content_pages
  .filter(p => p.text && p.url)
  .map(p => ({ url: p.url, text: cleanText(p.text) }))

const prioritized = cleaned.sort((a, b) => {
  const important = ['/about', '/services', '/pricing', '/contact', '/faq']
  const aScore = important.some(p => a.url.includes(p)) ? 1 : 0
  const bScore = important.some(p => b.url.includes(p)) ? 1 : 0
  return bScore - aScore
})

const content = await prepareScrapedContent(prioritized, 8000)

trimmed = content.slice(0, 32000)

}



  let pdfText = ""

if (req.files?.pdfs) {
  for (const file of req.files.pdfs) {
    const text = await extractPDFText(file.buffer)
    pdfText += text + "\n"
  }
}

      if (!name || !systemPrompt || !userId) {
        return res.status(400).json({
          message: "Missing required fields"
        })
      }

      // Access uploaded files
      const logoFile = req.files?.logo?.[0]
      const pdfFiles = req.files?.pdfs || []

      console.log('Received data:', { name, systemPrompt, userId, website })
      console.log('Logo file:', logoFile?.originalname)
      console.log('PDF files:', pdfFiles.length)

      // Upload logo to Supabase Storage
      let logoUrl = null
      if (logoFile) {
        const fileExt = logoFile.originalname.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `logos/${fileName}`

        const { data: logoData, error: logoError } = await supabase.storage
          .from('chatbot-logos') 
          .upload(filePath, logoFile.buffer, {
            contentType: logoFile.mimetype,
            cacheControl: '3600'
          })

        if (logoError) throw logoError

        const { data: { publicUrl } } = supabase.storage
          .from('chatbot-logos')
          .getPublicUrl(filePath)

        logoUrl = publicUrl
      }

      // Upload PDFs to Supabase Storage
      const pdfUrls = []
      for (const pdf of pdfFiles) {
        const fileExt = pdf.originalname.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `pdfs/${fileName}`

        const { data: pdfData, error: pdfError } = await supabase.storage
          .from('chatbot-logos')
          .upload(filePath, pdf.buffer, {
            contentType: pdf.mimetype,
            cacheControl: '3600'
          })

        if (pdfError) throw pdfError

        const { data: { publicUrl } } = supabase.storage
          .from('chatbot-logos')
          .getPublicUrl(filePath)

        pdfUrls.push(publicUrl)
      }


      // Generate share token
      const shareToken =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)


const { data, error } = await supabase.rpc(
  "create_chatbot_with_credits",
  {
    p_firebase_uid: userId,
    p_name: name,
    p_system_prompt: systemPrompt,
    p_share_token: shareToken,
    p_logo_url: logoUrl,
    p_website_url: website || null,
    p_website_content: trimmed || '',
    p_pdf_content: pdfText || null,
    p_pdf_urls: pdfUrls.length > 0 ? JSON.stringify(pdfUrls) : null,
    p_color: color || "#000",
    p_agent_type: agentType || 'info',
    p_notification_email: notificationEmail || null,
  }
)


  if (error) {
  console.error("RPC error:", error)  // ← Add this to see the REAL error
  }
      return res.status(201).json({
        success: true,
        chatbot: data
      })


    } catch (error) {
      console.error("Create chatbot error:", error)
      return res.status(500).json({
        message: error.message || "Internal Server Error"
      })
    }
  }
)

app.delete("/api/chat/:id" , async (req,res) => {

const { id } = req.params
  const { userId } = req.body

  const { error } = await supabase
    .from("chatbots")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)

  if (error) {
    return res.status(400).json({ message: "Delete failed" })
  }

  res.json({ success: true })

})

app.get('/api/credits/:userId', async (req, res) => {
  const { userId } = req.params

  const { data, error } = await supabase
    .from('users')
    .select('credits, plan,monthly_message_count,monthly_message_limit,plan')
    .eq('firebase_uid', userId)
    .maybeSingle()

  if (error) {
    return res.status(400).json({ message: error.message })
  }

  if (!data) {
    return res.status(404).json({ message: 'User not found' })
  }

  res.json({ credits: data.credits,plan:data.plan,message_count:data.monthly_message_count,limit:data.monthly_message_limit,plan:data.plan})
})

app.post('/api/register', async(req,res) => {

const { firebase_uid } = req.body

if(!firebase_uid){
  return res.status(403).json({message:"no userId for registeration"})
}
  
  const { error } = await supabase
    .from('users')
    .insert({
      firebase_uid,
      credits: 10,
      plan: "free",
      monthly_message_limit: 500,
      monthly_message_count: 0
    })
  if (error && error.code !== '23505') {
    return res.status(400).json({ message: error.message })
  }

  res.json({ success: true })

})

  app.get('/approve/:bookingId', async (req, res) => {
  const bookingId = req.params.bookingId
  const booking = pendingBookings[bookingId]

  if (!booking) return res.send('<h2>Booking not found or server restarted.</h2>')

  booking.status = 'confirmed'

  try {
    await bookCalendarEvent(booking.chatbot, booking)
    console.log('Calendar event created!')
  } catch (err) {
    console.error('Calendar booking failed:', err.message)
  }

  await sendUserConfirmed(bookingId)

  res.send(`
    <html><body style="font-family:sans-serif;text-align:center;padding:60px">
      <h2>✅ Booking Confirmed!</h2>
      <p>${booking.name} has been notified and a calendar event has been created.</p>
      <p>Time: ${booking.datetime}</p>
    </body></html>
  `)
})

app.get('/auth/google', (req, res) => {
  const { shareToken } = req.query

  if (!shareToken) {
    return res.status(400).send('Missing shareToken')
  }

  const oauth2Client = getOAuthClient()
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar'],
    state: shareToken  // passes through OAuth flow
  })

  res.redirect(url)
})

// Step 2 — Google redirects back here after login
app.get('/auth/google/callback', async (req, res) => {
  const { code, state: shareToken } = req.query

  if (!code) {
    return res.status(400).send('Missing code from Google')
  }

  try {
    const oauth2Client = getOAuthClient()
    const { tokens } = await oauth2Client.getToken(code)

    // Save tokens to Supabase
    const { error } = await supabase
      .from('chatbots')
      .update({
        google_access_token: tokens.access_token,
        google_refresh_token: tokens.refresh_token
      })
      .eq('share_token', shareToken)

    if (error) {
      console.error('Supabase update error:', error)
      return res.send('<h2>Failed to save tokens. Please try again.</h2>')
    }

    console.log('Google Calendar connected for:', shareToken)

    res.redirect(`${process.env.FRONTEND_URL}/dashboard?calendar=connected`)

  } catch (err) {
    console.error('OAuth callback error:', err.message)
    res.status(500).send('OAuth failed: ' + err.message)
  }
})


app.use("/api", paymentRoutes);

app.use("/api", chatRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
