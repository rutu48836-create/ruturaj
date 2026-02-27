
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import express from "express"
import cors from 'cors'
import supabase from "../config/supabaseClient.js"

export const Create_checkout_session = async (req,res) =>{

  const { userId, email } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer_email: email,
    line_items: [
      {
        price: "prod_U3T7AJiXhVeMv8", 
        quantity: 1,
      },
    ],
    success_url: "https://alexa-mighty.vercel.app/",
    cancel_url: "https://alexa-mighty.vercel.app/Login",
  });

  res.json({ url: session.url });


}

export const Stripe_webhook =  async (req, res) => {
  const sig = req.headers["stripe-signature"];

  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const email = session.customer_email;

    // find user in supabase
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    await supabase
      .from("users")
      .update({
        plan: "premium",
        message_limit: 2000,
        subscription_status: "active",
      })
      .eq("id", user.id);
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;

    await supabase
      .from("users")
      .update({
        plan: "free",
        message_limit: 500,
        subscription_status: "inactive",
      })
      .eq("stripe_subscription_id", subscription.id);
  }

  res.json({ received: true });
};
