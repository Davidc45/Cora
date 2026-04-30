'use client';

import { useEffect } from 'react';

/**
 * Client-only component that manages the service worker (`/sw.js`).
 *
 * Registers the SW in all environments — it's required for push
 * notifications and offline caching. In development, the SW's
 * fetch handler already uses network-first for pages and
 * network-only for API routes, so registration is safe.
 *
 * Handles "zombie" registrations left over from previous code that
 * unregistered workers — clears them and re-registers cleanly.
 */
export default function RegisterSw() {
  useEffect(() => {
    if (!('serviceWorker' in navigator) || !window.isSecureContext) return;

    (async () => {
      try {
        const existing = await navigator.serviceWorker.getRegistration('/');
        // Clear zombie registrations (deleted state: no workers attached)
        if (existing && !existing.active && !existing.installing && !existing.waiting) {
          await existing.unregister();
        }

        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
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
      } catch (err) {
        console.error('SW registration failed', err);
      }
    })();
  }, []);
  return null;
}
