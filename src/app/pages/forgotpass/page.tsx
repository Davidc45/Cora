'use client';

import { forgotpass } from '@/app/components/actions';
import { useSearchParams } from 'next/navigation';
import { Err } from '@/app/components/client-components';
import Link from 'next/link';
import Image from 'next/image';

function safeDecode(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

/**
 * Forgot password — request reset email (Supabase).
 * Figma: hero art, title, email, Send Code, return home. Recovery link targets `/pages/resetpass`.
 */
export default function ForgotPass() {
  const searchParams = useSearchParams();
  const successRaw = searchParams.get('success');
  const err = searchParams.get('err');
  const success = successRaw ? safeDecode(successRaw) : null;

  return (
    <div className="reset-pw-page">
      <div className="reset-pw-card">
        <div className="reset-pw-hero">
          <Image
            src="/assets/reset-password-image.png"
            alt=""
            width={440}
            height={250}
            sizes="(max-width: 480px) 52vw, 220px"
            priority
            style={{ width: '100%', height: 'auto' }}
          />
        </div>

        <h1 className="reset-pw-title">Reset Password</h1>
        <p className="reset-pw-lead">
          Please enter your email address below and we will send you a One Time
          Password
        </p>

        {success ? (
          <p className="reset-pw-success" role="status">
            {success}
          </p>
        ) : null}
        {err ? <Err message={safeDecode(err)} /> : null}

        <form className="reset-pw-form">
          <label htmlFor="reset-pw-email" className="reset-pw-label">
            Email
          </label>
          <input
            id="reset-pw-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="reset-pw-input"
            placeholder="example@gmail.com"
          />
          <div className="reset-pw-actions">
            <button type="submit" formAction={forgotpass} className="reset-pw-btn">
              Send Code
            </button>
          </div>
        </form>

        <div className="reset-pw-footer">
          <Link href="/" className="reset-pw-home-link">
            ← return to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
