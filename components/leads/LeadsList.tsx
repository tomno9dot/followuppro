"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface Lead {
  _id: string
  name: string
  email: string
  serviceOffered: string
  status: string
}

export default function LeadsList() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/leads")
      .then(res => res.json())
      .then(data => {
        setLeads(data)
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load leads")
        setLoading(false)
      })
  }, [])

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this lead?")
    if (!confirmDelete) return

    try {
      await fetch(`/api/leads/${id}`, {
        method: "DELETE"
      })

      setLeads(prev => prev.filter(lead => lead._id !== id))
    } catch {
      alert("Failed to delete lead")
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-gray-200 text-gray-800"
      case "contacted":
        return "bg-blue-200 text-blue-800"
      case "proposal_sent":
        return "bg-yellow-200 text-yellow-800"
      case "closed_won":
        return "bg-green-200 text-green-800"
      case "closed_lost":
        return "bg-red-200 text-red-800"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  if (loading) {
    return <p className="text-gray-500">Loading leads...</p>
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  if (leads.length === 0) {
    return (
      <div className="text-gray-500">
        No leads yet. Add your first client.
      </div>
    )
  }

  return (
    <div className="space-y-4">

      {leads.map((lead) => (
        <div
          key={lead._id}
          className="bg-white p-4 rounded-xl border shadow-sm flex justify-between items-center"
        >

          {/* Left Side */}
          <div>
            <p className="font-semibold">{lead.name}</p>
            <p className="text-sm text-gray-500">{lead.email}</p>
            <p className="text-sm text-gray-500">{lead.serviceOffered}</p>

            <span
              className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${statusColor(lead.status)}`}
            >
              {lead.status.replace("_", " ")}
            </span>
          </div>

          {/* Right Side */}
          <div className="flex space-x-3">
            <Link
              href={`/dashboard/${lead._id}`}
              className="text-blue-600 hover:underline text-sm"
            >
              View
            </Link>

            <button
              onClick={() => handleDelete(lead._id)}
              className="text-red-600 hover:underline text-sm"
            >
              Delete
            </button>
          </div>

        </div>
      ))}

    </div>
  )
}