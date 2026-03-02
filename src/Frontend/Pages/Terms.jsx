
import { useState } from "react";
import { NavBar } from "../Components/NavBar";
import styles from "../Styles/Terms.module.css"

export function Terms(){

return(

    <div className={styles.Terms_wrapper}>

    <NavBar/>
    <div className={styles.Terms_content}>

     <h1>Terms and Condition</h1>

     <span>⚠️ Beta Notice: Lunaar is currently in beta. Features may change, and the platform is still under active development.</span>
<span>Lunaar is currently offered as a beta product. This means:

The platform is under active development and features may be added, changed, or removed at any time without prior notice.
The Service may contain bugs, errors, or incomplete functionality.
We do not guarantee uninterrupted availability or data persistence during the beta period.
We are not liable for any loss of data, revenue, or business impact resulting from beta instability.
Beta access may be revoked or restricted at any time at our discretion.</span>

<span>Account Registration

You are responsible for maintaining the confidentiality of your account credentials.
You are responsible for all activity that occurs under your account.
You must provide accurate and up-to-date information during registration.
Notify us immediately if you suspect unauthorized access to your account.
We reserve the right to suspend or terminate accounts that violate these Terms.</span>

    </div>



    </div>




)





}