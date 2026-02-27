
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import express from "express"
import cors from 'cors'
import {supabase} from "../config/supabaseClient.js"


export const Create_checkout_session = async (req,res) =>{

  const { userId, email } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer_email: email,
    line_items: [
      {
        price: "price_1T5MB6CHRn55lhqvGXXzDWI7", 
        quantity: 1,
      },
    ],     
  metadata: {
    user_id: userId,
  },
    success_url: "https://alexa-mighty.vercel.app/",
    cancel_url: "https://alexa-mighty.vercel.app/Login",
  });

  res.json({ url: session.url });


}

export const Stripe_webhook =  async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const userId = session.metadata?.user_id;

    if (!userId) {
      console.log("❌ No user_id in metadata");
      return res.json({ received: true });
    }

     if (!subscription || !subscription.id) {
    console.log("❌ Subscription object missing");
    return res.json({ received: true });
  }


    const { error } = await supabase
      .from("users")
      .update({
        plan: "premium",
        message_limit: 2000,
        subscription_status: "active",
      })
      .eq("id", userId);

    if (error) console.log("Supabase error:", error);
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;

    const { error } = await supabase
      .from("users")
      .update({
        plan: "free",
        message_limit: 500,
        subscription_status: "inactive",
      })
      .eq("stripe_subscription_id", subscription.id);

    if (error) console.log("Supabase error:", error);
  }

  res.json({ received: true });
};
