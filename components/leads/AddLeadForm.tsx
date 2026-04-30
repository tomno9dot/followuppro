"use client"

import { useState } from "react"

export default function AddLeadForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [service, setService] = useState("")
  const [dealValue, setDealValue] = useState("")
  const [nextFollowUp, setNextFollowUp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          serviceOffered: service,
          dealValue: Number(dealValue),
          nextFollowUpAt: nextFollowUp
            ? new Date(nextFollowUp)
            : null
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to add lead")
      }

      setName("")
      setEmail("")
      setService("")
      setDealValue("")
      setNextFollowUp("")

      window.location.reload()

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      <input
        type="text"
        placeholder="Client Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        required
      />

      <input
        type="email"
        placeholder="Client Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        required
      />

      <input
        type="text"
        placeholder="Service Offered"
        value={service}
        onChange={(e) => setService(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        required
      />

      <input
        type="number"
        placeholder="Deal Value ($)"
        value={dealValue}
        onChange={(e) => setDealValue(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />

      <input
        type="date"
        value={nextFollowUp}
        onChange={(e) => setNextFollowUp(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg"
      >
        {loading ? "Adding..." : "Add Lead"}
      </button>

    </form>
  )
}