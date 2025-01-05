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

const MonthlySpendChart = ({ subscriptions }: SpendingChartProps) => {
  const [spendingData, setSpendingData] = useState<Record<string, number[]>>({})
  const [labels, setLabels] = useState<string[]>([])
  const [activeCategories, setActiveCategories] = useState<string[]>(['All'])

  const categories = ['All', 'Entertainment', 'Utilities', 'Food', 'Software', 'Transport', 'Other']

  const getColor = (category: string, alpha = 1) => {
    const colors: Record<string, string> = {
      All: `rgba(108, 54, 232, ${alpha})`,
      Entertainment: `rgba(255, 99, 132, ${alpha})`,
      Utilities: `rgba(54, 162, 235, ${alpha})`,
      Food: `rgba(75, 192, 192, ${alpha})`,
      Software: `rgba(153, 102, 255, ${alpha})`,
      Transport: `rgba(255, 159, 64, ${alpha})`,
      Other: `rgba(201, 203, 207, ${alpha})`,
    }
    return colors[category] || `rgba(0, 0, 0, ${alpha})`
  }

  useEffect(() => {
    const processSubscriptions = () => {
      const monthlyData: Record<string, Record<string, number>> = {}

      // Initialize data for each category
      categories.forEach((category) => {
        monthlyData[category] = {}
      })

      subscriptions.forEach((sub) => {
        const startDate = new Date(sub.renewalDate)
        const today = new Date()

        // Calculate endDate based on subscription status
        const endDate =
          sub.status === 'cancelled'
            ? sub.cancellationDate
              ? new Date(sub.cancellationDate)
              : today
            : new Date(today.setFullYear(today.getFullYear() + 1))

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
      tension: 0.4,
    })),
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Poppins, sans-serif',
            size: 12,
          },
        },
        onClick: (e, legendItem, chart) => {
          const index = chart.data.datasets.findIndex(
            (dataset) => dataset.label === legendItem.text
          )
          chart.setDatasetVisibility(index, !chart.isDatasetVisible(index))
          chart.update()
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw
            const category = context.dataset.label
            return `${category}: £${value.toFixed(2)}`
          },
        },
      },
      title: {
        display: true,
        text: 'Monthly Spending by Category',
        font: {
          family: 'Poppins, sans-serif',
          size: 18,
        },
      },
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Month',
          color: '#6c36e8',
          font: {
            size: 16,
            family: 'Poppins, sans-serif',
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Spending (£)',
          color: '#6c36e8',
          font: {
            size: 16,
            family: 'Poppins, sans-serif',
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutCubic',
    },
    elements: {
      point: {
        radius: 5,
        hoverRadius: 8,
      },
    },
  }

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`px-4 py-2 rounded shadow-md ${
              activeCategories.includes(category) ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="relative h-96 w-full">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}

export default MonthlySpendChart












