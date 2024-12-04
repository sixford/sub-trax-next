'use client'

import Link from 'next/link'
import Image from 'next/image'

const HeroPage = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-purpleMain text-ivoryBackground text-center relative">
      {/* Logo Section */}
      <div className="absolute top-8">
        <Image
          src="/images/subtrax2.svg"
          alt="SubTrax Logo"
          width={64}
          height={64}
        />
      </div>

      {/* Content Card */}
      <div className="bg-ivoryBackground/80 p-8 rounded-xl shadow-lg max-w-lg">
        <h1 className="text-4xl font-extrabold mb-6 text-purpleMain drop-shadow-lg">
          Welcome to SubTrax
        </h1>
        <p className="text-lg mb-8 text-purpleMain">
          Effortlessly track your subscriptions and manage your spending in one
          place...
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/register">
            <button className="bg-goldAccent text-purpleMain py-2 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition">
              Get Started
            </button>
          </Link>
          <Link href="/login">
            <button className="bg-transparent border border-pinkAccent text-pinkAccent py-2 px-6 rounded-lg font-semibold shadow-md hover:bg-pinkAccent hover:text-ivoryBackground transform hover:scale-105 transition">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HeroPage