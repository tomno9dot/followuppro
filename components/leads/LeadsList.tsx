"use client"

import { useEffect, useState } from "react"

interface Lead {
  _id: string
  name: string
  email: string
  status: string
  nextFollowUpAt: string
}

export default function LeadsList() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        setLeads(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading...</p>

  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">
          You don’t have any leads yet.
        </p>
        <p className="text-sm text-gray-400">
          Add your first lead to start tracking follow-ups.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="py-3">Name</th>
            <th className="py-3">Email</th>
            <th className="py-3">Status</th>
            <th className="py-3">Follow-Up</th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id} className="border-b hover:bg-gray-50 transition">
              <td className="py-3 font-medium">{lead.name}</td>
              <td className="py-3 text-gray-500">{lead.email}</td>
              <td className="py-3 capitalize">{lead.status}</td>
              <td className="py-3">
                {new Date(lead.nextFollowUpAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}