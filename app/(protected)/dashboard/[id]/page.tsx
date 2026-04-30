"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Lead {
  _id: string
  name: string
  email: string
  serviceOffered: string
  status: string
  dealValue?: number
  nextFollowUpAt?: string
}

interface Message {
  _id: string
  subject: string
  content: string
  createdAt: string
}

export default function LeadDetail({ params }: { params: { id: string } }) {
  const router = useRouter()

  const [lead, setLead] = useState<Lead | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leadsRes = await fetch("/api/leads")
        const leads = await leadsRes.json()

        const found = leads.find((l: Lead) => l._id === params.id)

        if (!found) {
          router.push("/dashboard")
          return
        }

        setLead(found)

        const msgRes = await fetch(`/api/messages/${params.id}`)
        const msgData = await msgRes.json()
        setMessages(msgData)

      } catch {
        setError("Failed to load lead data")
      }
    }

    fetchData()
  }, [params.id, router])

  const updateStatus = async (newStatus: string) => {
    try {
      await fetch(`/api/leads/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })

      if (lead) {
        setLead({ ...lead, status: newStatus })
      }

    } catch {
      setError("Failed to update status")
    }
  }

  const generateFollowUp = async () => {
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: params.id })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "AI generation failed")
        setLoading(false)
        return
      }

      setSubject(data.subject)
      setContent(data.content)

      const msgRes = await fetch(`/api/messages/${params.id}`)
      const msgData = await msgRes.json()
      setMessages(msgData)

    } catch {
      setError("Something went wrong")
    }

    setLoading(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content)
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-gray-100 p-10">
        <p className="text-gray-500">Loading lead...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10 space-y-8">

      {/* ✅ Lead Info */}
      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-3">
        <h1 className="text-2xl font-bold">{lead.name}</h1>
        <p className="text-gray-600">{lead.email}</p>
        <p className="text-gray-600">{lead.serviceOffered}</p>

        <div>
          <label className="block text-sm font-medium mb-1">
            Deal Value ($)
          </label>
          <p className="text-gray-800">
            ${lead.dealValue || 0}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Next Follow-Up
          </label>
          <p className="text-gray-800">
            {lead.nextFollowUpAt
              ? new Date(lead.nextFollowUpAt).toLocaleDateString()
              : "Not set"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            value={lead.status}
            onChange={(e) => updateStatus(e.target.value)}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="proposal_sent">Proposal Sent</option>
            <option value="closed_won">Closed Won</option>
            <option value="closed_lost">Closed Lost</option>
          </select>
        </div>
      </div>

      {/* ✅ AI Generator */}
      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">

        <h2 className="text-lg font-semibold">
          Generate Follow-Up
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">
            {error}
          </div>
        )}

        <button
          onClick={generateFollowUp}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate AI Follow-Up"}
        </button>

        {subject && (
          <div className="space-y-4 mt-4">

            <div>
              <label className="block text-sm font-medium mb-1">
                Subject
              </label>
              <input
                value={subject}
                readOnly
                className="w-full border px-4 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email Content
              </label>
              <textarea
                value={content}
                readOnly
                className="w-full border px-4 py-2 rounded-lg h-40"
              />
            </div>

            <button
              onClick={copyToClipboard}
              className="text-blue-600 hover:underline text-sm"
            >
              Copy to Clipboard
            </button>

          </div>
        )}
      </div>

      {/* ✅ Message History */}
      {messages.length > 0 && (
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Message History
          </h2>

          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg._id} className="border-b pb-3">
                <p className="font-medium">{msg.subject}</p>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {msg.content}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}