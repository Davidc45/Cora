'use client'

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { revalidate } from "./components/actions";

/**
 * Home page: list of existing reports/complaints.
 *
 * Data:
 * - Fetches all rows from the `reports` table using the Supabase server client.
 *
 * Rendering:
 * - Simple list of report title + description.
 * - Placeholder element rendered when an image is not yet available.
 */
export default function Home() {
  const params = useSearchParams()
  const code = params.get('code') ?? ""
  const supabase = createClient()

  supabase.auth.onAuthStateChange((event, session) => {
    if(event === 'SIGNED_IN') {
      console.log('SIGNED_IN', session)
      revalidate()
    }
  })

return (
  <div className="home-page">
    <section className="home-page__hero">
      <div className="home-page__hero-left">
        <h1 className="home-page__title">
          Help keep everyone in your community
          <span className="home-page__highlight"> alert and informed.</span>
        </h1>

        <p className="home-page__subtitle">
          Our mission is to empower Orange County residents with real-time safety updates
          and a collaborative platform to protect our neighborhoods together.
        </p>

        <div className="home-page__buttons">
          <Link href="/pages/signup" className="home-page__btn home-page__btn--primary">
            Sign Up
          </Link>
          <Link href="/pages/interactive-map" className="home-page__btn home-page__btn--secondary">
            Explore Map
          </Link>
        </div>
      </div>

      <div className="home-page__hero-right">
        <img
          src="/assets/community-map.png"
          alt="Community overview"
          className="home-page__image"
        />
      </div>
    </section>
  </div>
);
