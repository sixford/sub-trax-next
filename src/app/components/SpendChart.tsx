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
  category: string
}

interface SpendingChartProps {
  subscriptions: Subscription[]
}

const getColor = (category: string, alpha = 1) => {
  const colors: Record<string, string> = {
    All: `rgba(255, 87, 51, ${alpha})`,
    Entertainment: `rgba(255, 195, 0, ${alpha})`,
    Utilities: `rgba(0, 168, 255, ${alpha})`,
    Food: `rgba(240, 78, 151, ${alpha})`,
    Software: `rgba(137, 196, 244, ${alpha})`,
    Transport: `rgba(82, 196, 26, ${alpha})`,
    Other: `rgba(144, 19, 254, ${alpha})`,
  }
  return colors[category] || `rgba(0, 0, 0, ${alpha})`
}

const MonthlySpendChart = ({ subscriptions }: SpendingChartProps) => {
  const [spendingData, setSpendingData] = useState<Record<string, number[]>>({})
  const [labels, setLabels] = useState<string[]>([])
  const [activeCategories, setActiveCategories] = useState<string[]>(['All'])

  const categories = ['All', 'Entertainment', 'Utilities', 'Food', 'Software', 'Transport', 'Other']

  useEffect(() => {
    const processSubscriptions = () => {
      const monthlyData: Record<string, Record<string, number>> = {}

      categories.forEach((category) => {
        monthlyData[category] = {}
      })

      subscriptions.forEach((sub) => {
        const startDate = new Date(sub.renewalDate)
        const today = new Date()
        const endDate =
          sub.status === 'cancelled'
            ? sub.cancellationDate
              ? new Date(sub.cancellationDate)
              : today
            : new Date(today.setFullYear(today.getFullYear() + 1))

        if (startDate > endDate) return

        const interval = sub.renewalInterval === 'monthly' ? 1 : 12

        while (startDate <= endDate) {
          const monthYear = startDate.toLocaleString('default', {
            month: 'short',
            year: 'numeric',
          })

          if (sub.category) {
            monthlyData[sub.category][monthYear] = (monthlyData[sub.category][monthYear] || 0) + sub.price
          }
          monthlyData['All'][monthYear] = (monthlyData['All'][monthYear] || 0) + sub.price

          startDate.setMonth(startDate.getMonth() + interval)
        }
      })

      const sortedMonths = Object.keys(monthlyData['All']).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      )

      const processedData: Record<string, number[]> = {}
      Object.keys(monthlyData).forEach((category) => {
        processedData[category] = sortedMonths.map((month) => monthlyData[category][month] || 0)
      })

      setLabels(sortedMonths)
      setSpendingData(processedData)
    }

    processSubscriptions()
  }, [subscriptions])

  const toggleCategory = (category: string) => {
    setActiveCategories((prev) =>
      prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]
    )
  }

  const chartData = {
    labels,
    datasets: activeCategories.map((category) => ({
      label: category,
      data: spendingData[category] || [],
      borderColor: getColor(category),
      backgroundColor: getColor(category, 0.3),
      fill: true,
      tension: 0.5,
      borderWidth: 3,
      pointBorderWidth: 2,
      pointHoverRadius: 8,
      pointHoverBackgroundColor: getColor(category),
      pointHoverBorderWidth: 3,
    })),
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { family: 'Poppins', size: 14 },
          color: '#fff',
          padding: 15,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: 'Monthly Spending by Category',
        font: { family: 'Poppins', size: 20 },
        color: '#fff',
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: { family: 'Poppins', size: 16 },
        bodyFont: { family: 'Poppins', size: 14 },
        borderColor: '#fff',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => `£${context.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#fff', font: { family: 'Poppins', size: 12 } },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#fff', font: { family: 'Poppins', size: 12 } },
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeInOutElastic',
    },
  }

  return (
    <div className="relative bg-gradient-to-br from-purple-700 via-pink-500 to-yellow-500 p-8 rounded-xl shadow-xl">
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`px-4 py-2 rounded-full shadow-lg ${
              activeCategories.includes(category)
                ? 'bg-gradient-to-r from-yellow-400 to-pink-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            } transition duration-300`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="relative h-[300px] w-full">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}

export default MonthlySpendChart

















