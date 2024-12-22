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
  name: string
  price: number
  renewalDate: string
  status: 'active' | 'cancelled'
  renewalInterval: 'monthly' | 'yearly'
  cancellationDate?: string
}

const MonthlySpendChart = () => {
  const [spendingData, setSpendingData] = useState<number[]>([])
  const [labels, setLabels] = useState<string[]>([])

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const response = await fetch('/api/subscriptions')
      const result = await response.json()

      if (result.success) {
        const monthlyData: Record<string, number> = {}

        result.data.forEach((sub: Subscription) => {
          const startDate = new Date(sub.renewalDate)
          const endDate = sub.status === 'active'
            ? new Date() // Active subscriptions should include up to the current month
            : sub.cancellationDate
              ? new Date(sub.cancellationDate)
              : new Date() // Default to current if no cancellation date
          
          const interval = sub.renewalInterval === 'monthly' ? 1 : 12

          while (startDate <= endDate) {
            const monthYear = startDate.toLocaleString('default', {
              month: 'short',
              year: 'numeric',
            })

            monthlyData[monthYear] = (monthlyData[monthYear] || 0) + sub.price

            // Increment date by renewal interval
            startDate.setMonth(startDate.getMonth() + interval)
          }
        })

        // Sort months and update state
        const sortedLabels = Object.keys(monthlyData).sort((a, b) => {
          const dateA = new Date(a)
          const dateB = new Date(b)
          return dateA.getTime() - dateB.getTime()
        })

        setLabels(sortedLabels)
        setSpendingData(sortedLabels.map((label) => monthlyData[label]))
      }
    }

    fetchSubscriptions()
  }, [])

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Monthly Spending (£)',
        data: spendingData,
        borderColor: '#6c36e8',
        backgroundColor: 'rgba(108, 54, 232, 0.3)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Spending',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  }

  return <Line data={chartData} options={chartOptions} />
}

export default MonthlySpendChart

