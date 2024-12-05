'use client'

import Link from 'next/link'
import Image from 'next/image'

const HeroPage = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-ivoryBackground text-center relative overflow-hidden">
      {/* Lava Lamp Effect */}
      <div className="absolute inset-0 -z-10">
        <div className="blob bg-purpleMain"></div>
        <div className="blob bg-goldAccent animation-delay-2000"></div>
        <div className="blob bg-pinkAccent animation-delay-4000"></div>
      </div>

      {/* Content Card */}
      <div className="bg-ivoryBackground/80 p-8 rounded-xl shadow-lg max-w-lg relative z-10">
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/subtrax2.svg"
            alt="SubTrax logo, your subscription tracker"
            width={80}
            height={80}
            className="drop-shadow-lg"
          />
        </div>
        <h1 className="text-4xl font-extrabold mb-6 text-purpleMain drop-shadow-lg">
          Welcome to SubTrax
        </h1>
        <p className="text-lg mb-8 text-purpleMain">
          Effortlessly track your subscriptions and manage your spending in one
          place.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/register">
            <button
              className="bg-goldAccent text-purpleMain py-2 px-6 w-full sm:w-auto rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition"
              aria-label="Register for SubTrax"
            >
              Get Started
            </button>
          </Link>
          <Link href="/login">
            <button
              className="bg-transparent border border-pinkAccent text-pinkAccent py-2 px-6 w-full sm:w-auto rounded-lg font-semibold shadow-md hover:bg-pinkAccent hover:text-ivoryBackground transform hover:scale-105 transition"
              aria-label="Login to SubTrax"
            >
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HeroPage

