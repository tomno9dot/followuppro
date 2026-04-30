"use client"

import { useEffect, useState } from "react"
import AppLayout from "@/components/layout/AppLayout"

interface Lead {
  _id: string
  name: string
  dealValue?: number
  status: string
}

const columns = [
  "new",
  "contacted",
  "proposal_sent",
  "closed_won",
  "closed_lost"
]

export default function PipelinePage() {
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
        <p className="text-gray-500">Loading pipeline...</p>
      </AppLayout>
    )
  }

  return (
    <AppLayout>

      <div className="space-y-6">

        <h1 className="text-3xl font-bold">
          Pipeline
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

          {columns.map((column) => {
            const columnLeads = leads.filter(
              (lead) => lead.status === column
            )

            const columnValue = columnLeads.reduce(
              (sum, lead) => sum + (lead.dealValue || 0),
              0
            )

            return (
              <div
                key={column}
                className="bg-gray-100 p-4 rounded-xl"
              >
                <div className="mb-4">
                  <h2 className="font-semibold capitalize">
                    {column.replace("_", " ")}
                  </h2>
                  <p className="text-sm text-gray-500">
                    ${columnValue.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-3">

                  {columnLeads.map((lead) => (
                    <div
                      key={lead._id}
                      className="bg-white p-3 rounded-lg shadow-sm border"
                    >
                      <p className="font-medium text-sm">
                        {lead.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        ${lead.dealValue || 0}
                      </p>
                    </div>
                  ))}

                </div>
              </div>
            )
          })}

        </div>

      </div>

    </AppLayout>
  )
}