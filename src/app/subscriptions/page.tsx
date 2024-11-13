'use client'

import { useEffect, useState } from 'react'

interface Subscription {
  _id: string
  name: string
  price: number
  renewalDate: string
  status: 'active' | 'canceled'
}

const SubscriptionDashboard = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Subscriptions</h2>
      <div className="subscription-list">
        {subscriptions.map((sub) => (
          <div key={sub._id} className="p-2 border mb-2 rounded">
            <h3 className="font-bold">{sub.name}</h3>
            <p>Price: ${sub.price}</p>
            <p>Renewal Date: {new Date(sub.renewalDate).toLocaleDateString()}</p>
            <p>Status: {sub.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubscriptionDashboard