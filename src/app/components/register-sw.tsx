'use client';

import { useEffect } from 'react';

/**
 * Client-only component that registers the service worker (`/sw.js`).
 *
 * Mounted once in the root layout so that:
 * - PWA install banners become available where supported.
 * - Web Push subscriptions can be created from client components.
 *
 * On each page load the SW is re-registered which triggers an update check.
 * If a new version is waiting, it activates immediately so cached assets
 * are refreshed without requiring the user to close all tabs.
 */
export default function RegisterSw() {
  useEffect(() => {
    if (
      window.isSecureContext &&
      'serviceWorker' in navigator
    ) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
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
