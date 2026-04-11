
import { useState,useEffect } from "react";
import styles from "../Styles/Navbar.module.css"
import {User,FileTerminal,LogOut,Menu,X,SendHorizontal,BadgeQuestionMark,Wallet, CircleQuestionMark, Circle,Search,PiggyBank,Ban} from 'lucide-react';
import {data, useNavigate} from "react-router"
import { useAuth } from "../Components/Auth.jsx";
import { signOut } from "firebase/auth";
import {auth} from "../config/Firebase.js"
import { onAuthStateChanged } from 'firebase/auth'
import { supabase } from "../config/supabaseClient.js";
import { useRazorpay } from './useRazorpay.jsx'


export function NavBar({credits, Side_bar_open, setSide_bar_open,setActive,active}){
    
   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate()
    const { user } = useAuth();
    const [Credit, setCredit] = useState(null)
    const [upgrade,setUpgrade] = useState(false)
    const [plan,setPlan] = useState('Free')
    const [terminate_plan,setTerminate_plan] = useState(false)
    const [confirm,setConfirm] = useState('')
    console.log(credits)

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user){
navigate('/Login')
    }

    const response = await fetch(`${BACKEND_URL}/api/credits/${user.uid}`)


    const data = await response.json()
    console.log('credits response:', data)
    if (data.credits !== undefined) {
      setCredit(data.credits)
    }

    if(data.plan !== undefined){
setPlan(data.plan)
    }
  })
  return () => unsubscribe()
}, [])

  async function Log_out(){

  try{

    await signOut(auth)
    navigate("/Login")

  }

  catch(error){
    console.log("error in logging out")
  }

  }

  
  const { subscribe, loading: upgradeLoading } = useRazorpay();

  const currentUser = auth.currentUser;

  const handleUpgrade = () => {
    subscribe({
      user: { name: currentUser?.displayName, email: currentUser?.email },
      onSuccess: () => {
        Plan_call();
      },
      onError: (msg) => {
        console.error("Payment error:", msg);
      },
    });
  };

  async function Plan_cancel(){



try {

    const { data: userData, error } = await supabase
      .from('users')
      .select('subscription_id')
      .eq('firebase_uid', user.firebase_uid)  
      .single();

          if (error || !userData?.subscription_id) {
      console.error('Could not fetch subscription_id:', error);
      return;
    }

  const res = await fetch(`${BACKEND_URL}/v1/api/cancel-subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscriptionId: userData.subscription_id,
      }),
    }); 

    const data = await res.json();
    console.log(data)


  }
  
  catch(error){

    console.log('error in cancelling plan',error)

  }

}

    

  

 
 return(

 <>
 
 <div className={styles.Navbar_wrapper}>

 <div className={styles.Navbar_details_section}>
<div className={styles.User_details}><SendHorizontal size={20} className={styles.lunaar}/> /
  <img src={user?.photoURL} referrerPolicy="no-referrer" alt="User Profile" />
    <span>{user?.displayName}</span>
</div>
 
 <div className={styles.User_settings}>
 
 { plan === 'free' && (
 <button className={styles.up_btn} onClick={() => {
handleUpgrade()
}}>Pro    <svg
      viewBox="0 0 16 16"
      class="bi bi-lightning-charge-fill"
      fill="currentColor"
      height="16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"
      ></path></svg></button>
 )}
   
    <button className={styles.Icon_btn} style={{background:"transparent"}}><User color='#797373' size={18} backgroundColor="#faf6f6" onClick={() => setSide_bar_open(true)}/></button>
   <a href="/Contact">
   <button className={styles.Icon_btn2} style={{background:"transparent"}}><CircleQuestionMark color='#797373' size={18} backgroundColor="#faf6f6"/></button></a>
    <button className={styles.Icon_btn2} style={{background:"transparent"}}><LogOut color="#797373" size={18} background="#faf6f6"/></button>
    <button className={styles.Icon_btn1} onClick={() => setActive(!active)} style={{background:"transparent"}}><Menu color="#797373" size={18} background="#faf6f6"/></button>
</div>
 </div>
 
 <div className={styles.Navbar_links_section}>

 <ul>
    <li>
    
    <a href="#">Home</a></li>
   <li><a href="#">Settings</a></li>
   <li> <a href="#">Upgrade</a></li>
   <li> <a href="#">Support</a> </li>
   <li> <a href="#">How to use</a> </li>
      <li> <a href="#">Chat bots</a> </li>

    </ul>

 </div>

 </div>

  {Side_bar_open && (

  <div className={styles.Side_bar_full_screen}>

    <div className={styles.Side_bar_head}>

  <h3>Lunaar<SendHorizontal /></h3> <button onClick={() => setSide_bar_open(false)}><X size={18}/></button>

    </div>

  <div className={styles.Side_bar_main_content}>

  <div className={styles.button_wrapper}>
    <button className={styles.upgrade_btn} onClick={() => {
handleUpgrade()
    }}>Upgrade</button>
    <button className={styles.pricing_btn} onClick={() => { alert('The pricing page is currently not available')}}>Pricing</button>
  </div>

  <div className={styles.User_details_side_bar}>

 <div className={styles.user_detail_row}>
  <span>Email</span> <h4>{user?.email}</h4>
 </div>

  <div className={styles.user_detail_row}>
  <span>Name</span> <h4>{user?.displayName}</h4>
 </div>

  <div className={styles.user_detail_row}>
  <span>Log Out?</span> <button onClick={Log_out}><LogOut size={16}/></button>
 </div>

   <div className={styles.user_detail_row}>
  <span>Plan</span> <h4>{plan}</h4>
 </div>

<div className={styles.user_detail_row}>
  <span>Credits</span> <h4>{credits}</h4>
 </div> 

 {plan === 'Pro'  && (
  <div className={styles.user_detail_row}>
  <span>Cancel Plan</span> <button style={{cursor:'pointer',background:"#ff5959"}} onClick={() => setTerminate_plan(true)}><Ban size={18} color="#fff"/></button>
 </div> 
 )}

  </div>

  </div>


  </div>

  )}


  {terminate_plan && (
    <div className={styles.project_delete_wrapper}>
              <div className={styles.project_delete_card}>
                <h3>Cancel Plan</h3>
                <span>This will cancel your Pro plan and downgraded to the free plan.but only after your billing cycle ends.</span>
                <label>To confirm, type "Cancel Plan"</label>
                <input type="text" onChange={(e) => setConfirm(e.target.value)} />
                <div className={styles.project_delete_btns}>
                  <button
                    className={styles.cancel_btn1}
                    disabled={confirm !== "Cancel Plan"}
                    onClick={() => {
                      setTerminate_plan(false);
                      setConfirm('');
                      Plan_cancel();
                    }}
                  >
                    Delete
                  </button>
                  <button className={styles.confirm_btn} onClick={() => setTerminate_plan(false)}>Cancel</button>
                </div>
              </div>
              </div>
  )}

  
 





</>

 )




  }
