'use client';

import { useEffect, useRef, useState } from 'react';
import { ensureGoogleMapsReady } from '@/lib/googleMapsLoader';

function resolveGoogleMapsApiKey(): string {
  return (
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY?.trim() ||
    ''
  );
}

function AddressFormsWithMaps({ apiKey }: { apiKey: string }) {
  const [address, setAddress] = useState({
    full: '',
    street: '',
    city: '',
    county: '',
    state: '',
    country: '',
    coordinates: [0, 0] as [number, number],
  });

  const [mapsReady, setMapsReady] = useState(false);
  const [mapsError, setMapsError] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const handlePlaceChanged = (place: google.maps.places.PlaceResult) => {
    const addr = place.address_components;
    if (!addr?.length) return;

    const lat = place.geometry?.location?.lat();
    const lng = place.geometry?.location?.lng();

    const getComponent = (
      type: string,
      format: 'short_name' | 'long_name' = 'long_name'
    ) => {
      return (
        addr.find((component) => component.types.includes(type))?.[format] ?? ''
      );
    };

    const streetNumber = getComponent('street_number', 'short_name');
    const route = getComponent('route', 'short_name');
    const street = `${streetNumber} ${route}`.trim();
    const city =
      getComponent('locality', 'short_name') ||
      getComponent('postal_town', 'short_name') ||
      getComponent('sublocality', 'short_name');
    const county = getComponent('administrative_area_level_2', 'short_name');
    const state = getComponent('administrative_area_level_1', 'short_name');
    const country = getComponent('country', 'short_name');
    const formatted = place.formatted_address?.trim() ?? '';

    setAddress((prev) => ({
      ...prev,
      full: formatted || street,
      street: street || formatted,
      city,
      county,
      state,
      country,
      coordinates: lat != null && lng != null ? [lng, lat] : prev.coordinates,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    let autocomplete: google.maps.places.Autocomplete | null = null;
    let timeoutId: number | null = null;

    async function loadAutocomplete() {
      try {
        timeoutId = window.setTimeout(() => {
          setMapsError(
            'Address autocomplete is taking too long to load. You can still type the address manually.'
          );
        }, 8000);

        await ensureGoogleMapsReady(
          apiKey,
          process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID?.trim() || undefined
        );

        await google.maps.importLibrary('places');

        if (!inputRef.current) return;

        autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: 'us' },
          fields: ['address_components', 'geometry', 'formatted_address'],
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete?.getPlace();
          if (place) {
            handlePlaceChanged(place);
          }
        });

        setMapsReady(true);
        if (timeoutId != null) window.clearTimeout(timeoutId);
      } catch (error) {
        console.error('Autocomplete load failed:', error);
        const details =
          error instanceof Error
            ? error.message
            : typeof error === 'string'
              ? error
              : '';
        setMapsError(
          `Google Maps autocomplete failed to load.${details ? ` (${details})` : ''}`
        );
        if (timeoutId != null) window.clearTimeout(timeoutId);
      }
    }

    loadAutocomplete();

    return () => {
      if (timeoutId != null) window.clearTimeout(timeoutId);
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [apiKey]);

  return (
    <>
      <input
        placeholder="Address"
        name="full"
        id="address"
        ref={inputRef}
        value={address.full || ''}
        onChange={handleChange}
        autoComplete="street-address"
        required
      />
      {!mapsReady && !mapsError ? (
        <p className="text-sm text-slate-600" role="status">
          Loading address autocomplete…
        </p>
      ) : null}
      {mapsError ? (
        <p className="text-sm text-amber-800 dark:text-amber-200" role="note">
          {mapsError}
        </p>
      ) : null}

      {/* Submit structured parts for the server action (kept hidden for a cleaner form). */}
      <input type="hidden" name="street" value={address.street || address.full || ''} />
      <input type="hidden" name="city" value={address.city || ''} />
      <input type="hidden" name="state" value={address.state || ''} />
      <input type="hidden" name="country" value={address.country || ''} />
      <input type="hidden" name="lng" value={String(address.coordinates?.[0] ?? 0)} />
      <input type="hidden" name="lat" value={String(address.coordinates?.[1] ?? 0)} />
    </>
  );
}

export function AddressForms() {
  const apiKey = resolveGoogleMapsApiKey();

  if (!apiKey) {
    return (
      <p className="text-sm text-amber-800 dark:text-amber-200">
        Address autocomplete needs{' '}
        <code className="rounded bg-black/10 px-1 dark:bg-white/10">
          NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        </code>{' '}
        in <code className="rounded bg-black/10 px-1 dark:bg-white/10">.env.local</code>{' '}
        (same variable as the explore map). Restart the dev server after changing env vars.
      </p>
    );
  }

  return <AddressFormsWithMaps apiKey={apiKey} />;
}