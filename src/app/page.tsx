'use client'

import Link from 'next/link'

const HeroPage = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-purpleMain text-ivoryBackground text-center">
      <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
        Welcome to Subtrax
      </h1>
      <p className="text-lg mb-10 max-w-xl drop-shadow-sm">
        Manage your subscriptions effortlessly and keep track of your monthly
        spending.
      </p>
      <div className="flex space-x-4">
        <Link href="/register">
          <button className="bg-goldAccent text-purpleMain py-2 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition">
            Get Started
          </button>
        </Link>
        <Link href="/login">
          <button className="bg-transparent border border-pinkAccent text-pinkAccent py-2 px-6 rounded-lg font-semibold shadow-md hover:bg-pinkAccent hover:text-purpleMain transform hover:scale-105 transition">
            Login
          </button>
        </Link>
      </div>
    </div>
  )
}

export default HeroPage

