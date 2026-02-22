import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import { Chat_handler } from './controllers/chatController.js'
import { scrapeWebsite } from './services/website_data.js'
import { supabase } from './config/supabaseClient.js'
import { extractPDFText } from './services/pdf_data.js'

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000

const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

console.log('SUPABASE_URL:', process.env.SUPABASE_URL)
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY?.substring(0, 20))

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



app.post('/api/create', 

  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'pdfs', maxCount: 10 }
  ]), 
  async (req, res) => {
    try {

const { website, name, systemPrompt, userId } = req.body
console.log('=== DEBUG ===')
console.log('userId:', userId)
console.log('name:', name)
console.log('body:', req.body)

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

      let website_data = null
      if (website) {
        try {
          website_data = await scrapeWebsite(website)
        } catch (err) {
          console.log('Error scraping website:', err)
        }
      }

      // Generate share token
      const shareToken =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)

const { error: userError } = await supabase
  .from('users')
  .insert({ firebase_uid: userId, credits: 10 })
  .select()

// Ignore duplicate error (user already exists)
if (userError && userError.code !== '23505') {
  console.error('User insert error:', userError)
  return res.status(400).json({ message: userError.message })
}
const { data, error } = await supabase.rpc(
  "create_chatbot_with_credits",
  {
    p_firebase_uid: userId,
    p_name: name,
    p_system_prompt: systemPrompt,
    p_share_token: shareToken,
    p_logo_url: logoUrl,
    p_website_url: website || null,
    p_website_content: website_data || '',
    p_pdf_content: pdfText || null,
    p_pdf_urls: pdfUrls.length > 0 ? JSON.stringify(pdfUrls) : null
  }
)

  if (error) {
    return res.status(400).json({message : "YOU HAVE USED ALL CREDITS.UPGRADE TO ENJOY LIMITLESS USEAGE"})
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
    .select('credits')
    .eq('firebase_uid', userId)
    .maybeSingle()

  if (error) {
    return res.status(400).json({ message: error.message })
  }

  if (!data) {
    return res.status(404).json({ message: 'User not found' })
  }

  res.json({ credits: data.credits })
})

app.post('/api/register', async(req,res) => {

  const { userId } = req.body

  const { error } = await supabase
    .from('users')
    .insert({ firebase_uid: userId, credits: 10 })

  if (error && error.code !== '23505') {
    return res.status(400).json({ message: error.message })
  }

  const data = await response.json()
console.log('Register response:', data)

  res.json({ success: true })


})


app.use("/api", Chat_handler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
