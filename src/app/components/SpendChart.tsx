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
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

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

      console.log('Fetched Subscriptions for Chart:', result.data)

      if (result.success) {
        const monthlyData: Record<string, number> = {}

        result.data.forEach((sub: Subscription) => {
          const startDate = new Date(sub.renewalDate)
          const endDate =
            sub.status === 'cancelled'
              ? sub.cancellationDate
                ? new Date(sub.cancellationDate)
                : new Date() // Fallback for missing cancellationDate
              : new Date(new Date().setFullYear(new Date().getFullYear() + 1)) // Project active subscriptions 1 year into the future
        
          // Ensure startDate <= endDate
          if (startDate > endDate) {
            console.error(
              `Invalid date range for subscription: ${sub.name}. Start Date: ${startDate}, End Date: ${endDate}`
            )
            return
          }
        
          const interval = sub.renewalInterval === 'monthly' ? 1 : 12
        
          while (startDate <= endDate) {
            const monthYear = startDate.toLocaleString('default', {
              month: 'short',
              year: 'numeric',
            })
        
            monthlyData[monthYear] = (monthlyData[monthYear] || 0) + sub.price
        
            console.log('MonthYear:', monthYear, 'Price:', sub.price)
        
            startDate.setMonth(startDate.getMonth() + interval)
          }
        })

        console.log('Processed Monthly Data:', monthlyData)

        // Sort by date
        const sortedMonths = Object.keys(monthlyData).sort((a, b) =>
          new Date(a).getTime() - new Date(b).getTime()
        )

        setLabels(sortedMonths)
        setSpendingData(sortedMonths.map((month) => monthlyData[month]))
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
  }

  return <Line data={chartData} options={chartOptions} />
}

export default MonthlySpendChart


