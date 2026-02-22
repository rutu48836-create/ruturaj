

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

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
   
    const response = await fetch(`${BACKEND_URL}/api/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: user.uid })
})

const data = await response.json()
console.log('Register response:', data)
    navigate('/', { replace: true })
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
