'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  subscribeUser,
  unsubscribeUser,
  type PushSubscriptionJSON,
} from '../../push/actions';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function AccountNotificationToggle() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function waitForActiveWorker(registration: ServiceWorkerRegistration) {
    if (registration.active) return registration;

    const candidate = registration.installing || registration.waiting;
    if (!candidate) return null;

    await new Promise<void>((resolve) => {
      const onStateChange = () => {
        if (candidate.state === 'activated') {
          candidate.removeEventListener('statechange', onStateChange);
          resolve();
        }
      };
      candidate.addEventListener('statechange', onStateChange);
      setTimeout(() => {
        candidate.removeEventListener('statechange', onStateChange);
        resolve();
      }, 4000);
    });

    const refreshed = await navigator.serviceWorker.getRegistration('/');
    return refreshed?.active ? refreshed : null;
  }

  async function hydrateExistingSubscription() {
    try {
      const registration = await getOrCreateRegistration();
      if (!registration) return;
      const existing = await registration.pushManager.getSubscription();
      if (existing) setIsSubscribed(true);
    } catch {
      /* ignore */
    }
  }

  async function getOrCreateRegistration() {
    if (!('serviceWorker' in navigator) || !window.isSecureContext) return null;
    const existing = await navigator.serviceWorker.getRegistration('/');
    if (existing?.active) return existing;
    try {
      const created = existing ?? await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      const ready = await navigator.serviceWorker.ready;
      if (ready?.active) return ready;
      return await waitForActiveWorker(created);
    } catch {
      return null;
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    ) {
      setIsSupported(true);
      void hydrateExistingSubscription();
    }
  }, []);

  async function handleToggle() {
    if (!isSupported || loading) return;
    if (isSubscribed) {
      await handleUnsubscribe();
    } else {
      await handleSubscribe();
    }
  }

  async function handleSubscribe() {
    setLoading(true);
    setError(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setError('Notifications are blocked in your browser settings.');
        setLoading(false);
        return;
      }
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) {
        setError('Push notifications are not configured on the server.');
        setLoading(false);
        return;
      }
      const registration = await getOrCreateRegistration();
      if (!registration) {
        setError('Service worker is not available. Refresh and try again.');
        setLoading(false);
        return;
      }
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      const serialized = JSON.parse(
        JSON.stringify(sub),
      ) as PushSubscriptionJSON;
      const result = await subscribeUser(serialized);
      if (!result?.success) {
        setError(result?.error ?? 'Failed to save subscription.');
        await sub.unsubscribe().catch(() => {});
        setLoading(false);
        return;
      }
      setIsSubscribed(true);
    } catch (err: unknown) {
      const msg = err && (err as Error).message ? (err as Error).message : '';
      setError('Failed to subscribe.' + (msg ? ` (${msg})` : ''));
    } finally {
      setLoading(false);
    }
  }

  async function handleUnsubscribe() {
    setLoading(true);
    setError(null);
    try {
      const registration = await getOrCreateRegistration();
      if (!registration) {
        setError('Service worker is not available.');
        setLoading(false);
        return;
      }
      const existing = await registration.pushManager.getSubscription();
      await existing?.unsubscribe();
      const result = await unsubscribeUser();
      if (!result?.success) {
        setError(result?.error ?? 'Failed to unsubscribe.');
      } else {
        setIsSubscribed(false);
      }
    } catch {
      setError('Failed to unsubscribe from notifications.');
    } finally {
      setLoading(false);
    }
  }

  if (!isSupported) {
    return (
      <div className="acct-notif">
        <div className="acct-notif__label">
          <Image
            src="/assets/account-page-notification-icon.png"
            alt=""
            width={18}
            height={18}
            className="acct-notif__label-icon"
          />
          Alert Preferences
        </div>
        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
          Push notifications are not supported on this device.
        </p>
      </div>
    );
  }

  return (
    <div className="acct-notif">
      <div className="acct-notif__label">
        <Image
          src="/assets/account-page-notification-icon.png"
          alt=""
          width={18}
          height={18}
          className="acct-notif__label-icon"
        />
        Alert Preferences
      </div>

      <div className="acct-notif__row">
        <div className="acct-notif__text">
          <strong>Push Notifications</strong>
          <span>Get instant community safety alerts</span>
        </div>
        <label className="acct-toggle">
          <input
            type="checkbox"
            checked={isSubscribed}
            onChange={handleToggle}
            disabled={loading}
          />
          <span className="acct-toggle__track" />
        </label>
      </div>

      {error && <p className="acct-notif__error">{error}</p>}
    </div>
  );
}
