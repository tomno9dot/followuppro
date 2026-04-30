"use client"

import { useState } from "react"

export default function SalesAssistant() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")

  const ask = async () => {
    const res = await fetch("/api/ai/sales-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    })

    const data = await res.json()
    setAnswer(data.answer)
  }

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
      <h3 className="font-semibold">Ask About Revenue Impact</h3>

      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Will this help me close more deals?"
        className="w-full border px-4 py-2 rounded-lg"
      />

      <button
        onClick={ask}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Ask
      </button>

      {answer && (
        <div className="text-sm text-gray-700 mt-4">
          {answer}
        </div>
      )}
    </div>
  )
}