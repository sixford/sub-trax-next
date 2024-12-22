'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const AddSubscriptionPage = () => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [renewalDate, setRenewalDate] = useState('')
  const [renewalInterval, setRenewalInterval] = useState('monthly')
  const [category, setCategory] = useState('Entertainment')
  const [status, setStatus] = useState('active')
  const router = useRouter()

  const categories = ['Entertainment', 'Utilities', 'Food', 'Software', 'Transport', 'Other']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const subscription = {
      name,
      price: parseFloat(price),
      renewalDate,
      renewalInterval,
      category,
      status,
    }

    const response = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    })

    if (response.ok) {
      router.push('/subscriptions')
    } else {
      const errorData = await response.json()
      console.error('Failed to add subscription:', errorData)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add Subscription</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Renewal Date</label>
          <input
            type="date"
            value={renewalDate}
            onChange={(e) => setRenewalDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Renewal Interval</label>
          <select
            value={renewalInterval}
            onChange={(e) => setRenewalInterval(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Add Subscription
        </button>
      </form>
    </div>
  )
}

export default AddSubscriptionPage