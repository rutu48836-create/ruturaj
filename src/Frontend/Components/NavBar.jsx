import { useState, useEffect } from "react";
import styles from "../Styles/Navbar.module.css";
import {
  FileTerminal,
  LogOut,
  Menu,
  X,
  SendHorizontal,
  CircleQuestionMark,
  Search,
  PiggyBank,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../Components/Auth.jsx";
import { signOut } from "firebase/auth";
import { auth } from "../config/Firebase.js";
import { onAuthStateChanged } from "firebase/auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// ✅ Defined outside NavBar so it never remounts on NavBar re-renders
function Upgrade({ upgrade, setUpgrade }) {
  useEffect(() => {
    if (!upgrade) return;

    function renderButton() {
      const container = document.getElementById("paypal-button-container");
      if (!container) return;

      container.innerHTML = "";

      window.paypal
        .Buttons({
          style: {
            shape: "rect",
            color: "gold",
            layout: "vertical",
            label: "subscribe",
          },

          fundingSource: undefined, // shows ALL funding sources including cards

          createSubscription: (data, actions) =>
            actions.subscription.create({
              plan_id: import.meta.env.VITE_PAYPAL_PLAN_ID.trim(),
            }),

          // ✅ Option 2: webhook handles the upgrade, we just close the modal
          onApprove: async (data) => {
            alert(
              "Subscription successful! Your plan will upgrade shortly."
            );
            setUpgrade(false);
          },

          onError: (err) => {
            console.error("PayPal error:", JSON.stringify(err));
            alert("Something went wrong with PayPal. Please try again.");
          },

          onCancel: () => {
            console.log("PayPal subscription cancelled by user.");
          },
        })
        .render("#paypal-button-container");
    }

    // Small delay to let React finish rendering the modal DOM
    const timer = setTimeout(() => {
      if (window.paypal) {
        renderButton();
      } else {
        if (!document.querySelector('script[src*="paypal.com/sdk"]')) {
          const script = document.createElement("script");
          script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&vault=true&intent=subscription&components=buttons,card-fields`;
          script.async = true;
          script.onload = renderButton;
          document.body.appendChild(script);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [upgrade]);

  if (!upgrade) return null;

  return (
    <div
      onClick={() => setUpgrade(false)}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "32px",
          width: "100%",
          maxWidth: "420px",
          overflow: "auto",
          maxHeight: "90vh",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ margin: 0 }}>Upgrade Plan</h2>
          <button
            onClick={() => setUpgrade(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "20px",
            }}
          >
            ✕
          </button>
        </div>
        <p style={{ color: "#666", marginBottom: "24px" }}>
          Subscribe to unlock premium features.
        </p>
        {/* minHeight prevents container collapsing before PayPal loads */}
        <div id="paypal-button-container" style={{ minHeight: "150px" }} />
      </div>
    </div>
  );
}

export function NavBar({ credits }) {
  const [Side_bar_open, setSide_bar_open] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [Credit, setCredit] = useState(null);
  const [upgrade, setUpgrade] = useState(false);
  const [plan, setPlan] = useState("Free");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/Login");
        return;
      }

      const response = await fetch(`${BACKEND_URL}/api/credits/${user.uid}`);
      const data = await response.json();

      if (data.credits !== undefined) {
        setCredit(data.credits);
      }

      if (data.plan !== undefined) {
        setPlan(data.plan);
      }
    });

    return () => unsubscribe();
  }, []);

  async function Log_out() {
    try {
      await signOut(auth);
      navigate("/Login");
    } catch (error) {
      console.log("error in logging out");
    }
  }

  return (
    <>
      <div className={styles.Navbar_wrapper}>
        <div className={styles.Navbar_details_section}>
          <div className={styles.User_details}>
            <SendHorizontal size={20} className={styles.lunaar} /> /
            <img
              src={user?.photoURL}
              referrerPolicy="no-referrer"
              alt="User Profile"
            />
            <span>{user?.displayName}</span>
          </div>

          <div className={styles.User_settings}>
            {plan === "free" && (
              <button
                className={styles.up_btn}
                onClick={() => setUpgrade(true)}
                style={{display:'hidden'}}
              >
                Pro{" "}
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  height="16"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z" />
                </svg>
              </button>
            )}
            <button className={styles.Icon_btn}>
              <LogOut color="#797373" size={18} />
            </button>
            <button
              className={styles.Icon_btn}
              onClick={() => setSide_bar_open(true)}
            >
              <Menu color="#797373" size={18} />
            </button>
          </div>
        </div>

        <div className={styles.Navbar_links_section}>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Settings</a></li>
            <li><a href="#">Upgrade</a></li>
            <li><a href="#">Support</a></li>
            <li><a href="#">How to use</a></li>
            <li><a href="#">Chat bots</a></li>
          </ul>
        </div>
      </div>

      {Side_bar_open && (
        <div className={styles.Side_bar_full_screen}>
          <div className={styles.Side_bar_head}>
            <h3>
              Lunaar
              <SendHorizontal />
            </h3>
            <button onClick={() => setSide_bar_open(false)}>
              <X size={18} />
            </button>
          </div>

          <div className={styles.Side_bar_main_content}>
            <div className={styles.button_wrapper}>
              <button
                className={styles.upgrade_btn}
                onClick={() => setUpgrade(true)}
              >
                Upgrade
              </button>
              <button className={styles.pricing_btn}>Pricing</button>
            </div>

            <div className={styles.User_details_side_bar}>
              <div className={styles.user_detail_row}>
                <span>Email</span>
                <h4>{user?.email}</h4>
              </div>

              <div className={styles.user_detail_row}>
                <span>Name</span>
                <h4>{user?.displayName}</h4>
              </div>

              <div className={styles.user_detail_row}>
                <span>Log Out?</span>
                <button onClick={Log_out}>
                  <LogOut size={16} />
                </button>
              </div>

              <div className={styles.user_detail_row}>
                <span>Plan</span>
                <h4>{plan}</h4>
              </div>

              <div className={styles.links_wrapper}>
                <button className={styles.link_btn}>
                  <a href="/Terms">
                    <FileTerminal size={18} color="#444441" />
                  </a>
                </button>
                <button className={styles.link_btn}>
                  <a href="/Contact">
                    <CircleQuestionMark size={18} color="#444441" />
                  </a>
                </button>
                <button className={styles.link_btn}>
                  <a href="/About">
                    <Search size={18} color="#444441" />
                  </a>
                </button>
                <button
                  className={styles.link_btn}
                  onClick={() => alert("We are working on paid versions")}
                >
                  <a href="#">
                    <PiggyBank size={18} color="#444441" />
                  </a>
                </button>
              </div>

              <div className={styles.user_usage}>
                <div className={styles.user_detail_row}>
                  <span>Credits</span>
                  <h4>{credits}</h4>
                </div>
                <button onClick={() => setUpgrade(true)}>Upgrade</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Upgrade renders at NavBar level, webhook handles plan upgrade */}
      <Upgrade upgrade={upgrade} setUpgrade={setUpgrade} />
    </>
  );
}
