
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import crypto from 'node:crypto'

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS  
  }
})

export const pendingBookings = {}

export async function sendConfirmation(chatbot,booking) {
  console.log('sendConfirmation called')
  console.log('agent_type:', chatbot.agent_type)
  console.log('notification_email:', chatbot.notification_email)

  if (chatbot.agent_type !== 'assistant') {
    console.log('BLOCKED: agent_type is not assistant, it is:', chatbot.agent_type)
    return { bookingId: null }   
  }

  if (!chatbot.notification_email) {
    console.log('BLOCKED: no notification_email set')
    return { bookingId: null }  
  }

    const bookingId = crypto.randomBytes(4).toString('hex').toUpperCase()

      pendingBookings[bookingId] = {
    ...booking,
    status: 'pending',
    chatbot
  }


  try {
    console.log('Attempting to send email to:', chatbot.notification_email)
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: chatbot.notification_email,
      subject: `New request from ${chatbot.name}`,
      html: `
    <h3>New Reservation Request</h3>
    <p><b>Name:</b> ${booking.name}</p>
    <p><b>Phone:</b> ${booking.phone}</p>
    <p><b>Requested Time:</b> ${booking.datetime}</p>
    <p>br>Extra details If any:${JSON.stringify(booking.details)}}
    <br>
     <a href="${process.env.BASE_URL}/approve/${bookingId}"
       style="background:#16a34a;color:white;padding:12px 24px;border-radius:6px;text-decoration:none">
      ✅ Confirm
    </a>
    &nbsp;&nbsp;
            <a href="${process.env.BASE_URL}/cancel/${bookingId}"
       style="background:#dc2626;color:white;padding:12px 24px;border-radius:6px;text-decoration:none">
      ❌ Cancel
    </a>
  `
    })
    console.log('Email sent successfully:', result.messageId)
  } catch (err) {
    console.error('Email send FAILED:', err.message)
    console.log('failed',err)
  }

  return { bookingId }

}

export async function sendUserConfirmed(bookingId) {
  const booking = pendingBookings[bookingId]
  if (!booking) return

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: booking.email, 
      subject: 'Your booking is confirmed! ✅',
      html: `
        <h2>Hi ${booking.name}! Your booking is confirmed 🎉</h2>
        <p><b>Date & Time:</b> ${booking.datetime}</p>
        <p>See you soon!</p>
        <p>— ${booking.chatbot.name}</p>
      `
    })
    console.log('Confirmation email sent to user:', booking.email)
  } catch (err) {
    console.error('User confirmation email FAILED:', err.message)
  }
}

export async function sendUserCancelled(bookingId){

  const booking = pendingBookings[bookingId]
  if (!booking) return

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: 'Booking update',
      html: `
        <h2>Hi ${booking.name},</h2>
        <p>Unfortunately the owner couldn't accommodate your request for <b>${booking.datetime}</b>.</p>
        <p>Please try booking a different time.</p>
        <p>— ${booking.chatbot.name}</p>
      `
    })
  } catch (err) {
    console.error('User cancellation email FAILED:', err.message)
  }


}
