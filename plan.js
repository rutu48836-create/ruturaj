const CLIENT_ID = "AUIiQcs6jJbgEUw57ayFzBKRKPcbyz7o50lz7XS2bQ85dYUklgH1Plfn2oEHm5JNUyuo_KSMRJalju5H";
const SECRET = "EChGd2kbcIGbjOt7zfz_OMTxPalAFXpHzaQ-0Gx4E6T3_wuvdZgFl1V14Lp3ALtrc1anRM67JCnJ_BNN";

const tokenRes = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
  method: "POST",
  headers: {
    "Accept": "application/json",
    "Authorization": "Basic " + btoa(`${CLIENT_ID}:${SECRET}`),
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: "grant_type=client_credentials",
});

const tokenData = await tokenRes.json();
if (!tokenData.access_token) {
  console.error("❌ Failed to get token:", tokenData);
  process.exit(1);
}
const access_token = tokenData.access_token;
console.log("✅ Got access token!");

const productRes = await fetch("https://api-m.paypal.com/v1/catalogs/products", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${access_token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Lunaar Pro",
    description: "Lunaar Pro subscription",
    type: "SERVICE",
    category: "SOFTWARE",
  }),
});

const product = await productRes.json();
if (!product.id) {
  console.error("❌ Product creation failed:", product);
  process.exit(1);
}
console.log("✅ Product created! ID:", product.id);

const planRes = await fetch("https://api-m.paypal.com/v1/billing/plans", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${access_token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    product_id: product.id,
    name: "Lunaar Pro Monthly",
    billing_cycles: [{
      frequency: { interval_unit: "MONTH", interval_count: 1 },
      tenure_type: "REGULAR",
      sequence: 1,
      total_cycles: 0,
      pricing_scheme: { fixed_price: { value: "9.99", currency_code: "USD" }}
    }],
    payment_preferences: { auto_bill_outstanding: true }
  }),
});

const plan = await planRes.json();

if (plan.id) {
  console.log("\n✅ Your LIVE Plan ID:", plan.id);
  console.log("👉 Add to .env: VITE_PAYPAL_PLAN_ID=" + plan.id);
} else {
  console.error("❌ Plan creation failed:", JSON.stringify(plan, null, 2));
}