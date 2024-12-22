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
        console.log('Fetched subscriptions:', result.data) // Debugging log
        // Existing processing logic
        const monthlyData: Record<string, number> = {}
  
        result.data.forEach((sub: Subscription) => {
          const startDate = new Date(sub.renewalDate)
          const endDate =
            sub.status === 'active'
              ? new Date() // Include up to the current month for active subscriptions
              : sub.cancellationDate
              ? new Date(sub.cancellationDate)
              : new Date() // Default to current date if no cancellation date
          const interval = sub.renewalInterval === 'monthly' ? 1 : 12
  
          while (startDate <= endDate) {
            const monthYear = startDate.toLocaleString('default', {
              month: 'short',
              year: 'numeric',
            })
  
            monthlyData[monthYear] = (monthlyData[monthYear] || 0) + sub.price
  
            startDate.setMonth(startDate.getMonth() + interval)
          }
        })
  
        console.log('Processed monthly data:', monthlyData) // Debugging log
  
        setLabels(Object.keys(monthlyData).sort())
        setSpendingData(Object.values(monthlyData))
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

