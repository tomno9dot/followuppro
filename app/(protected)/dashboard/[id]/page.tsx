"use client"

import { useEffect, useState, use } from "react"
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

export default function LeadDetail({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)  // ✅ FIX HERE
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

        const found = leads.find((l: Lead) => l._id === id)

        if (!found) {
          router.push("/dashboard")
          return
        }

        setLead(found)

        const msgRes = await fetch(`/api/messages/${id}`)
        const msgData = await msgRes.json()
        setMessages(msgData)

      } catch {
        setError("Failed to load lead data")
      }
    }

    fetchData()
  }, [id, router])

  const updateStatus = async (newStatus: string) => {
    try {
      await fetch(`/api/leads/${id}`, {
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
        body: JSON.stringify({ leadId: id })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "AI generation failed")
        setLoading(false)
        return
      }

      setSubject(data.subject)
      setContent(data.content)

      const msgRes = await fetch(`/api/messages/${id}`)
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

      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-3">
        <h1 className="text-2xl font-bold">{lead.name}</h1>
        <p className="text-gray-600">{lead.email}</p>
        <p className="text-gray-600">{lead.serviceOffered}</p>

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

      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
        <button
          onClick={generateFollowUp}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          {loading ? "Generating..." : "Generate AI Follow-Up"}
        </button>

        {subject && (
          <div className="space-y-4 mt-4">
            <input
              value={subject}
              readOnly
              className="w-full border px-4 py-2 rounded-lg"
            />

            <textarea
              value={content}
              readOnly
              className="w-full border px-4 py-2 rounded-lg h-40"
            />

            <button
              onClick={copyToClipboard}
              className="text-blue-600 underline text-sm"
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>

      {messages.length > 0 && (
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="font-semibold mb-4">
            Message History
          </h2>

          {messages.map((msg) => (
            <div key={msg._id} className="mb-4">
              <p className="font-medium">{msg.subject}</p>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {msg.content}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}