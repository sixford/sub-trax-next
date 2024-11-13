'use client'

import { useEffect, useState } from 'react'

interface Subscription {
  _id: string
  name: string
  price: number
  renewalDate: string
  status: 'active' | 'canceled'
}

