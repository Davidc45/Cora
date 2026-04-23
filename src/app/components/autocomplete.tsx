'use client';

import { useLoadScript } from '@react-google-maps/api';
import { useEffect, useState, useRef } from 'react';

const libraries = ['places'] as ('places')[];

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
    coordinates: [0, 0],
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  const handlePlaceChanged = (ac: google.maps.places.Autocomplete) => {
    const place = ac.getPlace();
    if (place) {
      setAddressComponents(place);
    }
  };

  const setAddressComponents = (place: google.maps.places.PlaceResult) => {
    const addr = place.address_components;
    if (!addr?.length) return;
    const lat = place.geometry?.location?.lat();
    const lng = place.geometry?.location?.lng();
    if (lat != null && lng != null) {
      console.log(`lat: ${lat}, lng: ${lng}`);
    }

    const byType = (type: string) =>
      addr.find((c) => c.types?.includes(type))?.short_name ?? '';

    const streetNumber = byType('street_number');
    const route = byType('route');
    const locality = byType('locality') || byType('postal_town');
    const admin1 = byType('administrative_area_level_1');
    const country = byType('country');

    const street = `${streetNumber} ${route}`.trim();
    const formatted = place.formatted_address?.trim() ?? '';

    setAddress((prev) => ({
      ...prev,
      full: formatted || street,
      street: street || formatted,
      city: locality,
      state: admin1,
      country,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`setting: ${name}: ${value}`);
    setAddress((values) => ({ ...values, [name]: value }));
  };

  useEffect(() => {
    if (!isLoaded || loadError) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current!, {
      componentRestrictions: { country: 'us' },
    });
    autocomplete.addListener('place_changed', () => {
      handlePlaceChanged(autocomplete);
    });
  }, [isLoaded, loadError]);

  if (!isLoaded) return <p>loading...</p>;
  if (loadError) return <p>error: {loadError.message}</p>;

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

      {/* Submit structured parts for the server action (kept hidden for a cleaner form). */}
      <input type="hidden" name="street" value={address.street || address.full || ''} />
      <input type="hidden" name="city" value={address.city || ''} />
      <input type="hidden" name="state" value={address.state || ''} />
      <input type="hidden" name="country" value={address.country || ''} />
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
