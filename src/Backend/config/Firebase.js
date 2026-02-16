

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider,signOut } from "firebase/auth";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAno4KklrPw2vP1yTDelGNUKr5gdTK9Ckg",
  authDomain: "shorter-dd8d7.firebaseapp.com",
  projectId: "shorter-dd8d7",
  storageBucket: "shorter-dd8d7.firebasestorage.app",
  messagingSenderId: "727231330493",
  appId: "1:727231330493:web:4429eb111e5077d82e5fd4",
  measurementId: "G-PCSZSGRHNL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
