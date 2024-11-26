'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Subscription {
  _id: string
  name: string
  price: number
  renewalDate: string
  status: 'active' | 'canceled'
}

const SubscriptionDashboard = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'canceled'>('all')
  const [sortBy, setSortBy] = useState<'renewalDate' | 'price'>('renewalDate')

  useEffect(() => {
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
  }, [])

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this subscription?')
    if (!confirmDelete) return

    try {
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSubscriptions((prev) => prev.filter((sub) => sub._id !== id))
      } else {
        const errorData = await response.json()
        console.error('Failed to delete subscription:', errorData)
      }
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  const filteredSubscriptions = subscriptions.filter((sub) =>
    filter === 'all' ? true : sub.status === filter
  )

  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
    if (sortBy === 'renewalDate') {
      return new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime()
    }
    return a.price - b.price;
  })

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Subscriptions</h2>
      <div className="mb-4">
        <Link href="/subscriptions/add">
          <button className="bg-green-500 text-white py-2 px-4 rounded">
            Add Subscription
          </button>
        </Link>
      </div>
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${
            filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded ${
            filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('canceled')}
          className={`px-4 py-2 rounded ${
            filter === 'canceled' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Cancelled
        </button>
      </div>
      <div className="mb-4">
        <label className="mr-2">Sort By:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'renewalDate' | 'price')}
          className="p-2 border rounded"
        >
          <option value="renewalDate">Renewal Date</option>
          <option value="price">Price</option>
        </select>
      </div>
      <div className="subscription-list">
        {sortedSubscriptions.map((sub) => (
          <div key={sub._id} className="p-2 border mb-2 rounded">
            <h3 className="font-bold">{sub.name}</h3>
            <p>Price: ${sub.price}</p>
            <p>Renewal Date: {new Date(sub.renewalDate).toLocaleDateString()}</p>
            <p>Status: {sub.status}</p>
            <button
              className="bg-red-500 text-white py-1 px-3 rounded mt-2"
              onClick={() => handleDelete(sub._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubscriptionDashboard
