'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import SpendingChart from '../components/SpendChart'

interface Subscription {
  _id: string
  name: string
  price: number
  renewalDate: string
  status: 'active' | 'cancelled'
  category: string
  cancellationDate?: string
}

const SubscriptionDashboard = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'cancelled' | string>('all')
  const [sortBy, setSortBy] = useState<'renewalDate' | 'price'>('renewalDate')

  const categories = ['All', 'Entertainment', 'Utilities', 'Food', 'Software', 'Transport', 'Other']

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchSubscriptions = async () => {
        const response = await fetch('/api/subscriptions')
        const result = await response.json()
        if (result.success) {
          setSubscriptions(result.data)
        } else {
          console.error('Failed to fetch subscriptions')
        }
      }
      fetchSubscriptions()
    }
  }, [status, session])

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return
    try {
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled', cancellationDate: new Date().toISOString() }),
      })
      if (response.ok) {
        setSubscriptions((prev) =>
          prev.map((sub) =>
            sub._id === id ? { ...sub, status: 'cancelled', cancellationDate: new Date().toISOString() } : sub
          )
        )
      } else {
        console.error('Failed to cancel subscription')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const filteredSubscriptions = subscriptions.filter((sub) => {
    if (filter === 'all') return true
    if (filter === 'active' || filter === 'cancelled') return sub.status === filter
    return sub.category === filter
  })

  const sortedSubscriptions = filteredSubscriptions.sort((a, b) =>
    sortBy === 'renewalDate'
      ? new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime()
      : a.price - b.price
  )

  if (status === 'loading') return <p>Loading...</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivoryBackground to-purpleMain flex justify-center items-center">
      <div className="card w-11/12 max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-purpleMain mb-4">Your Subscriptions</h2>
        <div className="mb-8">
          <SpendingChart subscriptions={subscriptions} />
        </div>
        <div className="mb-4 flex justify-between">
          <Link href="/subscriptions/add">
            <button className="bg-green-500 text-white py-2 px-4 rounded shadow-md hover:bg-green-600">
              Add Subscription
            </button>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="bg-red-500 text-white py-2 px-4 rounded shadow-md hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
        <div className="mb-4 flex space-x-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category === 'All' ? 'all' : category)}
              className={`px-4 py-2 rounded shadow-md ${
                filter === category || (filter === 'all' && category === 'All')
                  ? 'bg-purpleMain text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="mb-4">
          <label className="mr-2">Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'renewalDate' | 'price')}
            className="p-2 border rounded shadow-md"
          >
            <option value="renewalDate">Renewal Date</option>
            <option value="price">Price</option>
          </select>
        </div>
        <div>
          {sortedSubscriptions.length ? (
            sortedSubscriptions.map((sub) => (
              <div key={sub._id} className="p-4 mb-2 bg-gray-100 rounded-lg shadow-sm">
                <h3 className="font-bold text-purpleMain">{sub.name}</h3>
                <p>Price: £{sub.price}</p>
                <p>Renewal Date: {new Date(sub.renewalDate).toLocaleDateString()}</p>
                <p>Status: {sub.status}</p>
                <p>Category: {sub.category}</p>
                {sub.status === 'active' && (
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded mt-2 shadow-md hover:bg-red-600"
                    onClick={() => handleCancel(sub._id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No subscriptions found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default SubscriptionDashboard