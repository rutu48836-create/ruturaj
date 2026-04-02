// useRazorpay.js
import { useState } from "react";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const useRazorpay = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const subscribe = async ({ user, onSuccess, onError }) => {
    setLoading(true);
    setError(null);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Failed to load Razorpay. Check your internet connection.");

      // 1. Get subscription_id from backend
      const res = await fetch(`${BACKEND_URL}/api/create-subscription`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to create subscription.");
      const { subscription_id } = await res.json();

      // 2. Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        subscription_id,
        name: "Lunaar",
        description: "Upgrade to the Pro Plan to unlock up to 5 custom chatbots and increase your monthly capacity to 1,100 messages",
        image: "/logo.png",
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#2563EB" },

        handler: async (response) => {
          // 3. Verify payment on backend
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          if (!verifyRes.ok) throw new Error("Payment verification failed.");
          onSuccess?.();
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response) => {
        const msg = response.error?.description || "Payment failed.";
        setError(msg);
        onError?.(msg);
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      setError(err.message);
      onError?.(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { subscribe, loading, error };
};
