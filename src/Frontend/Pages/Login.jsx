

import {useState,useEffect} from 'react'
import styles from '../Styles/Login.module.css'
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/Firebase.js";
import { useNavigate } from 'react-router';
import { getAuth } from "firebase/auth"
import google from '../assets/google.svg'
import facebook from "../assets/facebook.svg"
import apple from "../assets/apple.svg"
import {SendHorizontal} from "lucide-react"

export function LOGIN(){

  const navigate = useNavigate()

  const BACKEND_URL = "http://localhost:5000"

 const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User:", result.user);
      alert("Logged in with Google!");

      navigate('/')

    } catch (err) {
      alert(err.message);
    }
  };

  return(

 <>
 
 
 <div className={styles.login_wrapper}>
<Nav/>

 <div className={styles.Card_Container}>

<div className={styles.Top_headings}>

<h2>Log in to Lunaar</h2>

</div>

 <div className={styles.Login_options_container}>

 <button onClick={loginWithGoogle}><img src={google}/> Google </button>
   <button><img src={apple}/>Apple</button>
 <button><img src={facebook}/>Facebook</button>
 </div>

 
 </div>

 </div>
 
 
 
 </>

    )



}

const Nav = () => {

return(

<div className={styles.Nav_wrapper}>


<h4>Lunaar<SendHorizontal size={20}/></h4>

<button>Contact</button>

</div>

)



}
