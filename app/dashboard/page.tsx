"use client"

import { useEffect, useState } from "react"
import AppLayout from "@/components/layout/AppLayout"
import AddLeadForm from "@/components/leads/AddLeadForm"
import LeadsList from "@/components/leads/LeadsList"

export default function DashboardPage() {
  const [leads, setLeads] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/leads")
      .then(res => res.json())
      .then(data => setLeads(data))
  }, [])

  const totalLeads = leads.length

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const followUpsToday = leads.filter((lead) => {
    const date = new Date(lead.nextFollowUpAt)
    date.setHours(0, 0, 0, 0)
    return date.getTime() === today.getTime()
  }).length

  const closedDeals = leads.filter(
    (lead) => lead.status === "closed_won"
  ).length

  return (
    <AppLayout>

      <h1 className="text-3xl font-bold mb-2">
        Dashboard
      </h1>

      <p className="text-gray-500 mb-10">
        Track your follow-ups and close more deals consistently.
      </p>

      {/* ✅ Metrics */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            Total Leads
          </p>
          <p className="text-3xl font-bold mt-3">{totalLeads}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            Follow-Ups Today
          </p>
          <p className="text-3xl font-bold mt-3">{followUpsToday}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            Deals Closed
          </p>
          <p className="text-3xl font-bold mt-3">{closedDeals}</p>
        </div>
      </div>

      {/* ✅ Main Grid */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* Add Lead */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-bold mb-2">
            Add New Lead
          </h2>

          <p className="text-gray-500 mb-6">
            Add a client and schedule your next follow-up.
          </p>

          <AddLeadForm />
        </div>

        {/* Leads List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-bold mb-6">
            Your Leads
          </h2>

          <LeadsList />
        </div>

      </div>

    </AppLayout>
  )
}