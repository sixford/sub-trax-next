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

interface SpendingChartProps {
  subscriptions: Subscription[]
}

const MonthlySpendChart = ({ subscriptions }: SpendingChartProps) => {
  const [spendingData, setSpendingData] = useState<number[]>([])
  const [labels, setLabels] = useState<string[]>([])

  useEffect(() => {
    const processSubscriptions = () => {
      const monthlyData: Record<string, number> = {}

      subscriptions.forEach((sub) => {
        const startDate = new Date(sub.renewalDate)
        const today = new Date()

        // Calculate endDate based on subscription status
        let endDate =
          sub.status === 'cancelled'
            ? sub.cancellationDate
              ? new Date(sub.cancellationDate)
              : today // Default to today if cancellationDate is missing
            : new Date(today.setFullYear(today.getFullYear() + 1)) // Project active subs 1 year into the future

        // Ensure startDate <= endDate
        if (startDate > endDate) {
          console.warn(
            `Invalid date range for subscription: ${sub.name}. Start Date: ${startDate}, End Date: ${endDate}. Adjusting endDate to match startDate.`
          )
          endDate = new Date(startDate) // Adjust endDate to match startDate
        }

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

      const sortedMonths = Object.keys(monthlyData).sort((a, b) =>
        new Date(a).getTime() - new Date(b).getTime()
      )

      setLabels(sortedMonths)
      setSpendingData(sortedMonths.map((month) => monthlyData[month]))
    }

    processSubscriptions()
  }, [subscriptions])

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
      legend: { position: 'top' as const },
      title: { display: true, text: 'Monthly Spending' },
    },
  }

  return <Line data={chartData} options={chartOptions} />
}

export default MonthlySpendChart







