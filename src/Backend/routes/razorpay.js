import Razorpay from "razorpay";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ─── Create Subscription ───────────────────────────────────────────────────
export const createSubscription = async (planId, totalCount = 12) => {
  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    total_count: totalCount,
    quantity: 1,
  });
  return subscription;
};

// ─── Verify Payment Signature ──────────────────────────────────────────────
export const verifyPaymentSignature = ({ razorpay_payment_id, razorpay_subscription_id, razorpay_signature }) => {
  const generated = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
    .digest("hex");

  return generated === razorpay_signature;
};

// ─── Verify Webhook Signature ──────────────────────────────────────────────
export const verifyWebhookSignature = (rawBody, signature) => {
  const generated = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  return generated === signature;
};

// ─── Fetch Subscription ────────────────────────────────────────────────────
export const getSubscription = async (subscriptionId) => {
  const subscription = await razorpay.subscriptions.fetch(subscriptionId);
  return subscription;
};

// ─── Cancel Subscription ───────────────────────────────────────────────────
export const cancelSubscription = async (subscriptionId, cancelAtCycleEnd = true) => {
  const result = await razorpay.subscriptions.cancel(subscriptionId, cancelAtCycleEnd);
  return result;
};

// ─── Fetch Payment Details ─────────────────────────────────────────────────
export const getPayment = async (paymentId) => {
  const payment = await razorpay.payments.fetch(paymentId);
  return payment;
};

// ─── Supabase: Activate Pro Plan ───────────────────────────────────────────
const activateProPlan = async (subscriptionId) => {
  const { error } = await supabase
    .from("users")
    .update({
      credits: 25,
      monthly_limit: 1000,
      plan: "pro",
      subscription_id: subscriptionId,
    })
    .eq("subscription_id", subscriptionId);

  if (error) throw new Error(`Failed to activate pro plan: ${error.message}`);
};

// ─── Supabase: Revert to Free Plan ─────────────────────────────────────────
const revertToFreePlan = async (subscriptionId) => {
  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("credits, monthly_limit")
    .eq("subscription_id", subscriptionId)
    .single();

  if (fetchError) throw new Error(`Failed to fetch user: ${fetchError.message}`);

  const { error: updateError } = await supabase
    .from("users")
    .update({
      plan: "free",
      subscription_id: null,
      monthly_limit: 10,
      credits: Math.min(user.credits, 10),
    })
    .eq("subscription_id", subscriptionId);

  if (updateError) throw new Error(`Failed to revert to free plan: ${updateError.message}`);
};

// ─── Supabase: Renew Pro Plan (on monthly charge) ──────────────────────────
const renewProPlan = async (subscriptionId) => {
  const { error } = await supabase
    .from("users")
    .update({
      credits: 25,
      monthly_limit: 1000,
    })
    .eq("subscription_id", subscriptionId);

  if (error) throw new Error(`Failed to renew pro plan: ${error.message}`);
};

// ─── Handle Webhook Events ─────────────────────────────────────────────────
export const handleWebhookEvent = async (event) => {
  const entity =
    event.payload?.subscription?.entity ||
    event.payload?.payment?.entity;

  const subscriptionId = entity?.id;

  switch (event.event) {
    case "subscription.activated":
      await activateProPlan(subscriptionId);
      console.log("✅ Subscription activated:", subscriptionId);
      return { action: "activate", subscriptionId };

    case "subscription.charged":
      // Fires every billing cycle — reset credits & limit
      await renewProPlan(subscriptionId);
      console.log("🔄 Subscription renewed:", subscriptionId);
      return { action: "renew", subscriptionId };

    case "subscription.cancelled":
      await revertToFreePlan(subscriptionId);
      console.log("❌ Subscription cancelled:", subscriptionId);
      return { action: "cancel", subscriptionId };

    case "subscription.halted":
      // Too many failed payments — treat same as cancel
      await revertToFreePlan(subscriptionId);
      console.log("⏸ Subscription halted:", subscriptionId);
      return { action: "suspend", subscriptionId };

    case "payment.failed":
      // Optionally send an email here via Supabase edge function or Resend
      console.log("💳 Payment failed for subscription:", subscriptionId);
      return { action: "payment_failed", subscriptionId };

    default:
      console.log("Unhandled event:", event.event);
      return { action: "unhandled" };
  }
};