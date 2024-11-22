'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const AddSubscriptionPage = () => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [renewalDate, setRenewalDate] = useState('')
  const [status, setStatus] = useState('active')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const subscription = {
      name,
      price: parseFloat(price),
      renewalDate,
      status,
    }

    const response = await fetch('api/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subscription)
    })