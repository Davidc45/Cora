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

    setAddress((prev) => ({
      ...prev,
      street: `${getComponent('street_number', 'short_name')} ${getComponent(
        'route',
        'short_name'
      )}`.trim(),
      city: getComponent('locality', 'short_name') || getComponent('sublocality', 'short_name'),
      county: getComponent('administrative_area_level_2', 'short_name'),
      state: getComponent('administrative_area_level_1', 'short_name'),
      country: getComponent('country', 'short_name'),
      coordinates:
        lat != null && lng != null ? [lng, lat] : prev.coordinates,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    let autocomplete: google.maps.places.Autocomplete | null = null;

    async function loadAutocomplete() {
      try {
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
      } catch (error) {
        console.error('Autocomplete load failed:', error);
        setMapsError('Google Maps autocomplete failed to load.');
      }
    }

    loadAutocomplete();

    return () => {
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [apiKey]);

  if (mapsError) return <p>error: {mapsError}</p>;
  if (!mapsReady) return <p>loading...</p>;

  return (
    <>
      <input
        placeholder="Address"
        name="street"
        id="street"
        ref={inputRef}
        value={address.street}
        onChange={handleChange}
      />

      <input
        placeholder="City"
        name="city"
        id="city"
        value={address.city}
        onChange={handleChange}
      />

      <input
        placeholder="State"
        name="state"
        id="state"
        value={address.state}
        onChange={handleChange}
      />

      <input
        placeholder="Country"
        name="country"
        id="country"
        value={address.country}
        onChange={handleChange}
      />
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