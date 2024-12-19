'use client'

import { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface Subscription {
  renewalDate: string
  price: number
}

const MonthlySpendChart = () => {
  const [spendingData, setSpendingData] = useState<number[]>([])
  const [labels, setLabels] = useState<string[]>([])

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const response = await fetch('/api/subscriptions')
      const result = await response.json()

      if (result.success) {
        // Group spending by month
        const monthlyData: Record<string, number> = {}

        result.data.forEach((sub: Subscription) => {
          const monthYear = new Date(sub.renewalDate).toLocaleString('default', {
            month: 'short',
            year: 'numeric',
          })

          if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = 0
          }
          monthlyData[monthYear] += sub.price
        });

        setLabels(Object.keys(monthlyData))
        setSpendingData(Object.values(monthlyData))
      }
    }

    fetchSubscriptions()
  }, [])


  } 
}