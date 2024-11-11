"use client"

import { useState } from 'react'

const AddSubscription = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    renewalDate: '',
    status: 'active',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      // Handle successful response
      console.log('Subscription added successfully')
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error)
    }
  }

  return (
    <div>
      <h2>Add Subscription</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="price">Price</label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="renewalDate">Renewal Date</label>
          <input
            type="date"
            id="renewalDate"
            name="renewalDate"
            value={formData.renewalDate}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Add Subscription
        </button>
      </form>
    </div>
  )
}

export default AddSubscription