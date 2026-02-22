
import { useState,useEffect } from "react";
import styles from "../Styles/Navbar.module.css"
import { LogOut,Menu,X,SendHorizontal} from 'lucide-react';
import {data, useNavigate} from "react-router"
import { useAuth } from "../Components/Auth.jsx";
import { signOut } from "firebase/auth";
import {auth} from "../config/Firebase.js"
import { onAuthStateChanged } from 'firebase/auth'
import { supabase } from "../config/supabaseClient.js";

export function NavBar(){
    
   const BACKEND_URL = import.meta.VITE_BACKEND_URL
    const [Side_bar_open,setSide_bar_open] = useState(false)
    const navigate = useNavigate()
    const { user } = useAuth();
    const [Credit, setCredit] = useState(null)

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) return

    const response = await fetch(`http://localhost:5000/api/credits/${user.uid}`)
    const data = await response.json()
    console.log('credits response:', data)
    if (data.credits !== undefined) {
      setCredit(data.credits)
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

  



 return(

 <>
 
 <div className={styles.Navbar_wrapper}>

 <div className={styles.Navbar_details_section}>
<div className={styles.User_details}><SendHorizontal/> /
<img src={user?.photoUrl}/><span>{user?.displayName}</span></div> <div className={styles.User_settings}>
    <button className={styles.Support_btn}>Support</button>
    <button className={styles.Logout_btn}><LogOut size={16}/></button>
    <button className={styles.Setting_btn} onClick={() => setSide_bar_open(true)}><Menu size={16}/></button>
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
    <button className={styles.upgrade_btn}>Upgrade</button>
    <button className={styles.pricing_btn}>Pricing</button>
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
  <span>Credits</span>
<h4>{Credit !== null ? Credit : '...'}</h4> 
 </div>

  </div>

  </div>


  </div>

  )}
 



 </>




 )



  }