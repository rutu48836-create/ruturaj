
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
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08)">
          
          <!-- Header -->
          <tr>
            <td style="background:#18181b;padding:28px 36px">
              <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:1.5px;color:#a1a1aa;text-transform:uppercase">Incoming Request</p>
              <h1 style="margin:6px 0 0;font-size:22px;font-weight:700;color:#ffffff">New Reservation</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 36px">

              <!-- Details card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border-radius:8px;border:1px solid #e4e4e7;margin-bottom:24px">
                <tr>
                  <td style="padding:20px 24px">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e4e4e7">
                          <span style="font-size:11px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:1px">Name</span><br>
                          <span style="font-size:15px;font-weight:600;color:#18181b;margin-top:2px;display:block">${booking.name}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e4e4e7">
                          <span style="font-size:11px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:1px">Phone</span><br>
                          <span style="font-size:15px;font-weight:600;color:#18181b;margin-top:2px;display:block">${booking.phone}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e4e4e7">
                          <span style="font-size:11px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:1px">Requested Time</span><br>
                          <span style="font-size:15px;font-weight:600;color:#18181b;margin-top:2px;display:block">${booking.datetime}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0">
                          <span style="font-size:11px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:1px">Extra Details</span><br>
                          <span style="font-size:15px;color:#3f3f46;margin-top:2px;display:block;line-height:1.5">${booking.details ? JSON.stringify(booking.details) : '—'}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Action buttons -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="48%" align="center">
                    <a href="${process.env.BASE_URL}/approve/${bookingId}"
                       style="display:block;background:#16a34a;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:14px 0;border-radius:8px;text-align:center;letter-spacing:0.3px">
                      ✅ Confirm Booking
                    </a>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" align="center">
                    <a href="${process.env.BASE_URL}/cancel/${bookingId}"
                       style="display:block;background:#ffffff;color:#dc2626;font-size:14px;font-weight:600;text-decoration:none;padding:14px 0;border-radius:8px;text-align:center;border:1.5px solid #dc2626;letter-spacing:0.3px">
                      ❌ Cancel Booking
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px;border-top:1px solid #f4f4f5">
              <p style="margin:0;font-size:12px;color:#a1a1aa;text-align:center">
                This email was sent automatically. Do not reply.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
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
        <h2>Hi ${booking.name}! Your reservation is confirmed 🎉</h2>
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
