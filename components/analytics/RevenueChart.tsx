"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

interface Lead {
  status: string
  dealValue?: number
  createdAt?: string
}

export default function RevenueChart({ leads }: { leads: Lead[] }) {

  const revenueByMonth: Record<string, number> = {}

  leads.forEach((lead) => {
    if (lead.status === "closed_won" && lead.createdAt) {
      const date = new Date(lead.createdAt)
      const month = date.toLocaleString("default", { month: "short" })

      revenueByMonth[month] =
        (revenueByMonth[month] || 0) +
        (lead.dealValue || 0)
    }
  })

  const data = Object.entries(revenueByMonth).map(
    ([month, revenue]) => ({
      month,
      revenue
    })
  )

  if (data.length === 0) {
    return (
      <div className="text-gray-500">
        No revenue data yet.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#2563eb"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}