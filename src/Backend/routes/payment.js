
// routes/payment.routes.js
import express from "express";
import {
  createSubscription,
  verifyPaymentSignature,
  verifyWebhookSignature,
  cancelSubscription,
  handleWebhookEvent,
} from "./razorpay.js";

const router = express.Router();

// POST /api/create-subscription
router.post("/create-subscription", async (req, res) => {
  try {
    const subscription = await createSubscription(process.env.RAZORPAY_PLAN_ID);
    res.json({ subscription_id: subscription.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/verify-payment
router.post("/verify-payment", (req, res) => {
  const isValid = verifyPaymentSignature(req.body);
  if (!isValid) return res.status(400).json({ error: "Invalid signature" });

  // TODO: Update user plan status in DB here
  res.json({ success: true });
});

// POST /api/cancel-subscription
router.post("/cancel-subscription", async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const result = await cancelSubscription(subscriptionId);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/webhook  (use express.raw middleware for this route!)
router.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const isValid = verifyWebhookSignature(req.body, signature);

  if (!isValid) return res.status(400).send("Invalid webhook signature");

  const event = JSON.parse(req.body);
  const result = handleWebhookEvent(event);

  console.log("Webhook handled:", result);
  res.json({ status: "ok" });
});

export default router;