'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const TOAST_DURATION_MS = 3000;

/**
 * Shows a momentary "You're now verified" popup when the user lands with ?verified=1
 * (e.g. after completing phone verification). Clears the query param and auto-hides.
 */
export default function VerifiedToast() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchParams.get('verified') !== '1') return;
    // Don't show again if we already started the hide timer (e.g. Strict Mode remount)
    if (hideTimerRef.current !== null) return;

    setVisible(true);
    router.replace('/pages/account', { scroll: false });

    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      hideTimerRef.current = null;
    }, TOAST_DURATION_MS);

    // Do not clear the timer in cleanup: router.replace() or Strict Mode can
    // trigger re-runs/unmount and would cancel the hide. Let the timer always fire.
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div className="verified-toast" role="status" aria-live="polite">
      You&apos;re now verified
    </div>
  );
}
