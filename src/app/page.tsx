'use client'

import Link from 'next/link'

const HeroPage = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-r from-purple-500 to-green-500 text-white">
      <h1 className="text-5xl font-bold mb-4">Welcome to SubTrax</h1>
      <p className="text-lg mb-8">
        Effortlessly track all your subscriptions in one place.
      </p>
      <div className="space-x-4">
        <Link href="/register">
          <button className="bg-white text-purple-500 py-2 px-4 rounded font-semibold">
            Get Started
          </button>
        </Link>
        <Link href="/login">
          <button className="bg-transparent border border-white py-2 px-4 rounded font-semibold">
            Login
          </button>
        </Link>
      </div>
    </div>
  )
}

export default HeroPage

