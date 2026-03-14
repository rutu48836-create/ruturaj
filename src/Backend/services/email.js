
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS  
  }
})

export async function sendNotifications(chatbot, userMessage, aiReply, orderDetails) {
  console.log('sendNotifications called')
  console.log('agent_type:', chatbot.agent_type)
  console.log('notification_email:', chatbot.notification_email)

  if (chatbot.agent_type !== 'sales') {
    console.log('BLOCKED: agent_type is not sales, it is:', chatbot.agent_type)
    return
  }

  if (!chatbot.notification_email) {
    console.log('BLOCKED: no notification_email set')
    return
  }

  const triggers = ['order', 'buy', 'purchase', 'price', 'interested', 'contact', 'book', 'custom']
  const isInteresting = triggers.some(t => userMessage.toLowerCase().includes(t))
  console.log('isInteresting:', isInteresting, '| message:', userMessage)



  try {
    console.log('Attempting to send email to:', chatbot.notification_email)
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: chatbot.notification_email,
      subject: `🛒 New Order via ${chatbot.name}`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:auto;border:1px solid #eee;border-radius:12px;padding:24px">
          <h2 style="margin-top:0">New Order Received 🎉</h2>
          <p>A customer placed an order through <b>${chatbot.name}</b></p>
          <div style="background:#f9f9f9;border-radius:8px;padding:16px;white-space:pre-line">${orderDetails}</div>
          <p style="color:#888;font-size:12px;margin-bottom:0">Sent by your AI sales agent</p>
        </div>
      `
    })
    console.log('Email sent successfully:', result.messageId)
  } catch (err) {
    console.error('Email send FAILED:', err.message)
  }
}