
import { google } from 'googleapis'
import { supabase } from '../config/supabaseClient.js'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

function getCalendarClient(chatbot) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )

  oauth2Client.setCredentials({
    access_token: chatbot.google_access_token,
    refresh_token: chatbot.google_refresh_token
  })

  return google.calendar({ version: 'v3', auth: oauth2Client })
}



export async function isSlotFree(chatbot, datetime, durationMinutes = 60) {

  if (!chatbot.google_access_token || !chatbot.google_refresh_token) {
    console.log('No Google Calendar connected, skipping check')
    return true
  }

  const calendar = getCalendarClient(chatbot)

  const start = new Date(datetime)
  const end = new Date(start.getTime() + durationMinutes * 60000)

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      items: [{ id: 'primary' }]
    }
  })

  const busy = res.data.calendars.primary.busy
  return busy.length === 0  
}

export async function getFreeSlots(chatbot, datetime, durationMinutes = 60) {
  const calendar = getCalendarClient(chatbot)

  const start = new Date(datetime)
  const end = new Date(start.getTime() + 7 * 24 * 60 * 60000) // check next 7 days

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      items: [{ id: 'primary' }]
    }
  })

  const busySlots = res.data.calendars.primary.busy

  // Generate hourly slots and filter out busy ones
  const freeSlots = []
  let current = new Date(start)
  current.setMinutes(0, 0, 0)

  while (freeSlots.length < 5 && current < end) {
    const slotEnd = new Date(current.getTime() + durationMinutes * 60000)

    // Skip non-working hours (before 9am or after 6pm)
    const hour = current.getHours()
    if (hour >= 9 && hour < 18) {
      const isBusy = busySlots.some(busy =>
        new Date(busy.start) < slotEnd && new Date(busy.end) > current
      )
      if (!isBusy) {
        freeSlots.push(current.toLocaleString('en-IN', {
          weekday: 'short', month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }))
      }
    }

    current = new Date(current.getTime() + 60 * 60000) // next hour
  }

  return freeSlots
}

// Create the calendar event (called when owner confirms)
export async function bookCalendarEvent(chatbot, booking) {
  const calendar = getCalendarClient(chatbot)

  const start = new Date(booking.datetime)
  const end = new Date(start.getTime() + 60 * 60000) // 1 hour default

  const event = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: `Meeting with ${booking.name}`,
      description: `Phone: ${booking.phone}\nEmail: ${booking.email}\n${
        Object.entries(booking.details || {})
          .map(([k, v]) => `${k}: ${v}`).join('\n')
      }`,
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() },
      attendees: [{ email: booking.email }],  // sends Google Calendar invite to user
      sendUpdates: 'all'
    }
  })

  console.log('Calendar event created:', event.data.htmlLink)
  return event.data
}

