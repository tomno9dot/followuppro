"use client"

import { useState } from "react"

export default function LeadDetail({ params }: any) {
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  const generateAI = async () => {
    setLoading(true)

    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: params.id,
        followUpType: "Gentle Reminder"
      })
    })

    const data = await res.json()

    setSubject(data.subject)
    setContent(data.content)

    setLoading(false)
  }

  return (
    <div className="p-6">
      <button
        onClick={generateAI}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Generating..." : "Generate Follow-Up"}
      </button>

      {subject && (
        <div className="mt-6 space-y-4">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border p-2 rounded h-40"
          />
        </div>
      )}
    </div>
  )
}