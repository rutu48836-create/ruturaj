
import express from 'express'
import {supabase} from "../config/supabaseClient.js"


const app = express()

app.use(express.json())
app.use(cors())


async function verifyPayPalWebhook(req, webhookId) {
  const response = await fetch("https://api-m.paypal.com/v1/notifications/verify-webhook-signature", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getPayPalAccessToken()}`,
    },
    body: JSON.stringify({
      webhook_id: webhookId,                          // from PayPal dashboard
      webhook_event: JSON.parse(req.body),
      cert_url: req.headers["paypal-cert-url"],
      auth_algo: req.headers["paypal-auth-algo"],
      transmission_id: req.headers["paypal-transmission-id"],
      transmission_sig: req.headers["paypal-transmission-sig"],
      transmission_time: req.headers["paypal-transmission-time"],
    }),
  });

  const data = await response.json();
  return data.verification_status === "SUCCESS";
}


app.post("/api/paypal-webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const event = JSON.parse(req.body);
  const eventType = event.event_type;

 const isValid = await verifyPayPalWebhook(req, process.env.PAYPAL_WEBHOOK_ID);
if (!isValid) return res.status(400).send("Invalid webhook");

  if (
    eventType === "BILLING.SUBSCRIPTION.ACTIVATED" ||
    eventType === "PAYMENT.SALE.COMPLETED"
  ) {
    const subscriptionId = event.resource.id || event.resource.billing_agreement_id;

    const payerEmail = event.resource?.subscriber?.email_address
      || event.resource?.payer?.email_address;

    const { error } = await supabase
      .from("users")
      .update({
        credits:25,          
        monthly_limit: 1000,
        plan: "pro",
        subscription_id: subscriptionId,
      })
      .eq("email", payerEmail);

    if (error) {
      console.error("DB update failed:", error);
      return res.status(500).send("DB error");
    }
  }

  if (eventType === "BILLING.SUBSCRIPTION.CANCELLED") {
    const subscriptionId = event.resource.id;

 const { data: user } = await supabase
    .from("users")
    .select("credits, monthly_limit")
    .eq("subscription_id", subscriptionId)
    .single();

  await supabase
    .from("users")
    .update({
      plan: "free",
      subscription_id: null,
      monthly_limit: 10,                         
      credits: Math.min(user.credits, 10),  
    })
    .eq("subscription_id", subscriptionId);

  res.status(200).send("OK");
}});
