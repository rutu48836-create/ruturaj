

import {useState,useEffect} from 'react'
import styles from '../Styles/Login.module.css'
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/Firebase.js";
import { useNavigate } from 'react-router';
import { getAuth } from "firebase/auth"


export function LOGIN(){

  const navigate = useNavigate()

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


 <div className={styles.Card_Container}>

<div className={styles.Top_headings}>

<h2>Let's start</h2>
<p>Please select the method you want to sign up.with sign up you would get 100 credits</p>

</div>

 <div className={styles.Login_options_container}>

 <button onClick={loginWithGoogle}>Google</button>
   <button>APPle</button>
 <button>Facebook</button>
 </div>

 

 <span>Already have an account? <a href="#">Sign In</a></span>

 </div>

 </div>
 
 
 
 </>

    )



}
