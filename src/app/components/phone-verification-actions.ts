'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

/** E.164: + followed by 10–15 digits. */
const E164_REGEX = /^\+[1-9]\d{9,14}$/;

function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, '');

  let normalized: string;

  if (digits.length === 10) {
    normalized = '+1' + digits;
  } 
  else if (digits.length === 11 && digits.startsWith('1')) {
    normalized = '+' + digits;
  } 
  else {
    normalized = '+' + digits;
  }

  if (!E164_REGEX.test(normalized)) {
    throw new Error('Invalid phone number');
  }

  return normalized;
}

/**
 * Send a one-time SMS OTP to the given phone number for the current user (phone-change flow).
 * Uses updateUser({ phone }) so the phone is linked to the existing auth user, not a new one.
 * Requires an authenticated user. Validates and normalizes phone to E.164.
 */
export async function sendPhoneOtp(phone: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: 'You must be signed in to verify your phone number.' };
  }

  let e164: string;
  try {
    e164 = toE164(phone);
  } catch {
    return { error: 'Please enter a valid phone number (e.g. +1 234 567 8900).' };
  }
  if (!E164_REGEX.test(e164)) {
    return { error: 'Please enter a valid phone number (e.g. +1 234 567 8900).' };
  }

  // Reject if this phone is already verified for a different user
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('phone', e164)
    .maybeSingle();

  if (existing && existing.id !== user.id) {
    return {
      error:
        'This phone number is already registered to another account. Use a different number or sign in to that account.',
    };
  }

  // Phone-change flow: sends OTP and links phone to this user when verified 
  const { error } = await supabase.auth.updateUser({
    phone: e164,
  });

  if (error) {
    const lower = error.message?.toLowerCase() ?? '';
    const msg =
      lower.includes('rate')
        ? 'Please wait a minute before requesting another code.'
        : lower.includes('service unavailable') ||
          lower.includes('provider') ||
          lower.includes('twilio')
        ? 'SMS verification is temporarily unavailable. Please try again in a few minutes.'
        : error.message || 'Failed to send code. Try again.';
    return { error: msg };
  }

  return {};
}

/**
 * Verify the SMS OTP and mark the user's profile as phone-verified.
 * On success, updates profiles.phone_verified and profiles.phone, then revalidates layout.
 */
export async function verifyPhoneOtp(
  phone: string,
  token: string
): Promise<{ error?: string }> {
  const supabase = await createClient();

  let e164: string;
  try {
    e164 = toE164(phone.trim());
  } catch {
    return { error: 'Please enter a valid phone number and request a new code.' };
  }
  const trimmedToken = token.trim().replace(/\s/g, '');
  if (!trimmedToken || trimmedToken.length < 4) {
    return { error: 'Please enter the code from the SMS.' };
  }

  const {
    data: { session },
    error: verifyError,
  } = await supabase.auth.verifyOtp({
    phone: e164,
    token: trimmedToken,
    type: 'phone_change',
  });

  if (verifyError) {
    const lower = verifyError.message?.toLowerCase() ?? '';
    const msg =
      lower.includes('expired')
        ? 'Code expired. Please request a new code.'
        : lower.includes('service unavailable') ||
          lower.includes('provider') ||
          lower.includes('twilio')
        ? 'SMS verification is temporarily unavailable. Please try again in a few minutes.'
        : verifyError.message || 'Invalid code. Try again.';
    return { error: msg };
  }

  const userId = session?.user?.id;
  if (!userId) {
    return { error: 'Verification succeeded but session was not found.' };
  }

  // Store phone in auth user metadata so it appears in Authentication → Users
  const { error: metaError } = await supabase.auth.updateUser({
    data: { phone: e164 },
  });
  if (metaError) {
    console.warn('Could not set user metadata phone:', metaError.message);
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      phone_verified: true,
      phone: e164,
    })
    .eq('id', userId);

  if (updateError) {
    return {
      error:
        updateError.message ||
        'Could not update your profile. You can try again from Account.',
    };
  }

  revalidatePath('/', 'layout');
  return {};
}
