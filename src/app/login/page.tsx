'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const LoginPage = () => {
  const { data: session, status } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/subscriptions')
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false, // Disable automatic redirection
    })

    if (result?.error) {
      setError(result.error || 'Invalid email or password')
    } else {
      router.push('/subscriptions')
    }
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-ivoryBackground">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-6 text-purpleMain">Login</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-purpleMain text-white py-2 px-4 rounded w-full hover:bg-purple-600 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage





