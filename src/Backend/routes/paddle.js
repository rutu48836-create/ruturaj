

import express from "express"
import cors from 'cors'
import {supabase} from "../config/supabaseClient.js"



const app = express()
app.use(cors())

app.post("/api/paddle-webhook", express.json(),Peddle_webhook)


app.use(express.json())

export const Peddle_webhook =  async (req, res) => {
   try {
    const event = req.body;

    console.log("Paddle event:", event.event_type);

    const data = event.data;

    if (event.event_type === "subscription.activated") {
      await supabase
        .from("users")
        .update({
          plan: "premium",
          paddle_subscription_id: data.id,
          paddle_status: data.status,
          subscription_renews_at: data.next_billed_at,
          credits:35
        })
        .eq("email", data.customer.email);

      console.log("User upgraded to premium");
    }

    // Subscription Canceled → Downgrade
    if (event.event_type === "subscription.canceled") {
      await supabase
        .from("users")
        .update({
          plan: "free",
          paddle_status: "canceled"
        })
        .eq("paddle_subscription_id", data.id);

      console.log("User downgraded to free");
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).send("Error");
  }
};

async function handleSubscriptionCreated(data) {
  const email = data.customer.email;

  await supabase
    .from("users")
    .update({
      plan: "premium",
      paddle_customer_id: data.customer_id,
      paddle_subscription_id: data.id,
      paddle_status: data.status,
      subscription_renews_at: data.next_billed_at,
      credits: 500  
    })
    .eq("email", email);
}

