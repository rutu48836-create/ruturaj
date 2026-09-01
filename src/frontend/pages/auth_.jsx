import { useState } from "react";
import { supabase } from "../compoents/supabaseConfig";
import styles from "../styles/auth.module.css"
import { FaGithub } from "react-icons/fa"
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom"
import comet_normal from "../assets/comet_normal.png"

export function Auth_page(){

  const navigate = useNavigate()
  const [loadingProvider, setLoadingProvider] = useState(null)

  const signIn = async (provider) => {
    if (loadingProvider) return;
    try {
      setLoadingProvider(provider)
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/Dashboard`
        }
      })
      if (error) {
        console.error(error)
        setLoadingProvider(null)
      }
    } catch (e) {
      console.error(e)
      setLoadingProvider(null)
    }
  }

  return(
    <div className={styles.auth_wrapper}>

      <div className={styles.art_panel}>
        <svg className={styles.orbit_svg} viewBox="0 0 400 400">
          <ellipse cx="200" cy="220" rx="150" ry="60" />
        </svg>
        <div className={styles.art_text}>
          <h1>Keep going<br/>where you<br/>left off.</h1>
          <p>Your lessons and progress are saved to your account.</p>
        </div>
      </div>

      <div className={styles.form_panel}>

        <button type="button" className={styles.back_btn} onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back
        </button>

        <div className={styles.form_inner}>
          <h2>Sign in</h2>
          <p className={styles.subtext}>Choose an account to continue with Lunaar</p>

          <div className={styles.btn_wrapper}>
            <button
              type="button"
              className={styles.primary_btn}
              onClick={() => signIn('google')}
              disabled={loadingProvider !== null}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33z"/>
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58z"/>
              </svg>
              {loadingProvider === 'google' ? "Connecting..." : "Continue with Google"}
            </button>

            <button
              type="button"
              className={styles.secondary_btn}
              onClick={() => signIn('github')}
              disabled={loadingProvider !== null}
            >
              <FaGithub size={18} />
              {loadingProvider === 'github' ? "Connecting..." : "Continue with GitHub"}
            </button>
          </div>

          <p className={styles.fine_print}>By continuing, you agree to Lunaar's terms of use.</p>
        </div>

      </div>

    </div>
  )
}