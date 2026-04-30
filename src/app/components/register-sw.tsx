'use client';

import { useEffect } from 'react';

/**
 * Client-only component that manages the service worker (`/sw.js`).
 *
 * Production: registers the SW and auto-activates new versions.
 * Development: actively unregisters any previously registered SW
 * to prevent stale workers from intercepting dev requests.
 */
export default function RegisterSw() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((reg) => {
          reg.unregister();
          console.log('[dev] Unregistered stale service worker:', reg.scope);
        });
      });
      return;
    }

    if (window.isSecureContext) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          reg.update();
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (!newWorker) return;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
                console.log('SW updated — new cache version active');
              }
            });
          });
        })
        .catch((err) => console.error('SW registration failed', err));
    }
  }, []);
  return null;
}
