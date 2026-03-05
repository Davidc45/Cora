import Link from "next/link";

export default async function Home() {
  return (
    <div className="home-container">
      <h2 className="home-message">
        Help keep everyone in your community alert and informed
        </h2>
        <h1 className="home-title">CORA</h1>
        <p className="home-mission-statement">
          Mission statement is in progress.
        </p>
      <div className="home-buttons">
        <Link href='/pages/explore' className="home-button">Explore</Link>
        <Link href='/pages/signup' className="home-button">Sign Up</Link>
      </div>
    </div>
  )
}