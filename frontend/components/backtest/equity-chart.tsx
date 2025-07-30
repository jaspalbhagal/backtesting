"use client"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface EquityChartProps {
  data: Array<{
    date: string
    value: number
    price?: number
    sma?: number
  }>
}

export function EquityChart({ data }: EquityChartProps) {
  const chartData = {
    labels: data.map((d) => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: "Portfolio Value",
        data: data.map((d) => d.value),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.1,
      },
      ...(data[0]?.price
        ? [
            {
              label: "Stock Price",
              data: data.map((d) => d.price || 0),
              borderColor: "rgb(34, 197, 94)",
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              tension: 0.1,
              yAxisID: "y1",
            },
          ]
        : []),
      ...(data[0]?.sma
        ? [
            {
              label: "SMA",
              data: data.map((d) => d.sma || 0),
              borderColor: "rgb(239, 68, 68)",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              tension: 0.1,
              yAxisID: "y1",
            },
          ]
        : []),
    ],
  }

  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Portfolio Performance",
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Portfolio Value ($)",
        },
      },
      ...(data[0]?.price
        ? {
            y1: {
              type: "linear" as const,
              display: true,
              position: "right" as const,
              title: {
                display: true,
                text: "Stock Price ($)",
              },
              grid: {
                drawOnChartArea: false,
              },
            },
          }
        : {}),
    },
  }

  return (
    <div className="w-full h-96">
      <Line data={chartData} options={options} />
    </div>
  )
}
