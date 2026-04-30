"use client"

import { useEffect, useState } from "react"
import AppLayout from "@/components/layout/AppLayout"
import AddLeadForm from "@/components/leads/AddLeadForm"
import LeadsList from "@/components/leads/LeadsList"
import RevenueChart from "@/components/analytics/RevenueChart"

interface Lead {
  _id: string
  status: string
  dealValue?: number
  nextFollowUpAt?: string
  createdAt?: string
}

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/leads")
      .then(res => res.json())
      .then(data => {
        setLeads(data)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <AppLayout>
        <div className="text-gray-500">Loading dashboard...</div>
      </AppLayout>
    )
  }

  // ✅ Metrics

  const totalLeads = leads.length

  const closedDeals = leads.filter(
    (lead) => lead.status === "closed_won"
  )

  const closedRevenue = closedDeals.reduce(
    (sum, lead) => sum + (lead.dealValue || 0),
    0
  )

  const pipelineValue = leads
    .filter(
      (lead) =>
        lead.status !== "closed_won" &&
        lead.status !== "closed_lost"
    )
    .reduce(
      (sum, lead) => sum + (lead.dealValue || 0),
      0
    )

  const revenueAtRisk = leads
    .filter(
      (lead) =>
        lead.status === "proposal_sent" ||
        lead.status === "contacted"
    )
    .reduce(
      (sum, lead) => sum + (lead.dealValue || 0),
      0
    )

  const closeRate =
    totalLeads > 0
      ? ((closedDeals.length / totalLeads) * 100).toFixed(1)
      : "0"

  const avgDealValue =
    closedDeals.length > 0
      ? (
          closedRevenue / closedDeals.length
        ).toFixed(0)
      : "0"

  const followUpsToday = leads.filter((lead) => {
    if (!lead.nextFollowUpAt) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const followDate = new Date(lead.nextFollowUpAt)
    followDate.setHours(0, 0, 0, 0)

    return followDate.getTime() === today.getTime()
  }).length

  // ✅ Performance Score

  const closeRateScore =
    totalLeads > 0
      ? (closedDeals.length / totalLeads) * 40
      : 0

  const followUpScore =
    followUpsToday > 0 ? 30 : 10

  const revenueScore =
    pipelineValue > 0
      ? Math.min((closedRevenue / pipelineValue) * 30, 30)
      : 0

  const performanceScore = Math.round(
    closeRateScore + followUpScore + revenueScore
  )

  return (
    <AppLayout>

      <div className="space-y-10">

        {/* ✅ Repositioned Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Revenue Recovery System
          </h1>
          <p className="text-gray-600">
            Identify at‑risk deals, improve follow‑up consistency, and close more high‑value clients.
          </p>
        </div>

        {/* ✅ Primary Revenue Metrics */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">

          <MetricCard label="Total Leads" value={totalLeads} />

          <MetricCard
            label="Closed Revenue"
            value={`$${closedRevenue.toLocaleString()}`}
          />

          <MetricCard
            label="Pipeline Value"
            value={`$${pipelineValue.toLocaleString()}`}
          />

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <p className="text-sm text-gray-500 uppercase">
              Revenue At Risk
            </p>
            <p className="text-2xl font-bold mt-2 text-red-600">
              ${revenueAtRisk.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Deals awaiting follow‑up
            </p>
          </div>

          <MetricCard
            label="Close Rate"
            value={`${closeRate}%`}
          />

          <MetricCard
            label="Average Deal Value"
            value={`$${Number(avgDealValue).toLocaleString()}`}
          />

        </div>

        {/* ✅ Performance Score */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-semibold mb-2">
            Consultant Performance Score
          </h2>

          <div className="flex items-center space-x-6">
            <div className="text-4xl font-bold text-blue-600">
              {performanceScore}
            </div>
            <div className="text-gray-600 text-sm">
              Based on close rate, follow‑up consistency, and revenue efficiency.
            </div>
          </div>

          <div className="mt-4 h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-600 rounded-full"
              style={{ width: `${performanceScore}%` }}
            />
          </div>

          <div className="mt-4 text-sm text-gray-600 space-y-1">
            {closeRateScore < 15 && (
              <p>• Improve follow‑up timing to increase close rate.</p>
            )}
            {followUpScore < 20 && (
              <p>• Schedule more consistent follow‑ups.</p>
            )}
            {revenueScore < 15 && (
              <p>• Focus on higher‑value deals to improve efficiency.</p>
            )}
          </div>
        </div>

        {/* ✅ Revenue Chart */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Revenue Overview
          </h2>
          <RevenueChart leads={leads} />
        </div>

        {/* ✅ Main Workspace */}
        <div className="grid lg:grid-cols-2 gap-8">

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Add High‑Value Lead
            </h2>
            <AddLeadForm />
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Your Pipeline
            </h2>
            <LeadsList />
          </div>

        </div>

      </div>

    </AppLayout>
  )
}

/* ✅ Reusable Metric Component */
function MetricCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <p className="text-sm text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-2xl font-bold mt-2">
        {value}
      </p>
    </div>
  )
}