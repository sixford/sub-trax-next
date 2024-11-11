"use client"

import { useState } from 'react'

const AddSubscription = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    renewalDate: '',
    status: 'active',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      if (result.success){
        alert('Subscription added successfully')
        setFormData({ name: '', price: '', renewalDate: '', status: 'active' })
      } else {
        alert('Failed to add subscription')
      }
    } catch (error) {
      console.error('Failed to add subscription', error)
    }
  }


  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Add a New Subscription</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Subscription Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Renewal Date</label>
          <input
            type="date"
            name="renewalDate"
            value={formData.renewalDate}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Add Subscription
        </button>
      </form>
    </div>
  )
}

export default AddSubscription