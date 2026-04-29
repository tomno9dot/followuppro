"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddLeadForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [serviceOffered, setServiceOffered] = useState("")
  const [nextFollowUpAt, setNextFollowUpAt] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          serviceOffered,
          nextFollowUpAt
        })
      })

      if (res.ok) {
        setName("")
        setEmail("")
        setServiceOffered("")
        setNextFollowUpAt("")
        router.refresh()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow">
      <input
        type="text"
        placeholder="Client name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        placeholder="Client email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Service offered"
        value={serviceOffered}
        onChange={(e) => setServiceOffered(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        value={nextFollowUpAt}
        onChange={(e) => setNextFollowUpAt(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Lead"}
      </button>
    </form>
  )
}