/* 
  Log in page
  - added a toggle password button, which allows the 
    user to change the input type from 'passord' to 
    'text', in case they want to see their password
  - added link to /pages/forgotpass for password support
*/

'use client'

import { login, signInWithGoogle } from "@/app/components/actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation"
import { FormEvent, useState } from "react";
import Err from "@/app/components/err";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";
import ReCaptchaProvider from "@/app/components/captchaprovider";
import React from "react";
import { log } from "console";


const Login: React.FC = () => {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const searchParams = useSearchParams();
  const errMessage = searchParams.get('err')
  const [showPass, setShowPass] = useState(false)

  const togglePass = () => {
    if(showPass) { setShowPass(false) } 
    else { setShowPass(true) }
  }

  const loginWithCaptcha = async (e: FormData) => {
    if(!executeRecaptcha) {
      console.log('unable to use recaptcha')
      return;
    }

    const gRecaptchaToken = await executeRecaptcha('form_submit');
    console.log('token', gRecaptchaToken)

    const response = await fetch('../api/captcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({gRecaptchaToken})
    });

    const data = await response.json();

    if(data.success) {
      console.log('captcha success: ', data);
      // for when captcha works
      // login(e);
    } else {
      console.log('error: ', data.score)

    }
  }

  return (
    <form className="login-container" onSubmit={loginWithCaptcha}>
      <h2>Sign In</h2>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required />

      <label htmlFor="password">Password</label>
      <div className="password-block">
        <input id="password" name="password" className="password"
          type={ showPass ? 'text' : 'password' } required 
        />
        <div onClick={togglePass} className="icon">
          { showPass ? 
            <img src='/assets/hide.png' alt="hide" className="view-icon"/> :
            <img src='/assets/view.png' alt="view" className="view-icon"/> 
          }
        </div>
      </div>

      <Link href='/pages/forgotpass'>Forgot Password?</Link>

      <button type="submit" className="login-button">Login</button>
      <div className="or">or</div>
      <div onClick={signInWithGoogle} className="google-login">Sign in with Google</div>
      <footer>Don't have an account? <Link href='/pages/signup'>Sign-up here</Link></footer>
      { errMessage ? <Err message={errMessage}/> : <></>}
    </form>
  )
}

export default function LoginWithReCaptcha() {
  return(
    <ReCaptchaProvider>
      <Login />
    </ReCaptchaProvider>
  )
}