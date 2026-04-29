"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
  const [businessType, setBusinessType] = useState("freelancer")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
  setLoading(true)

  try {
    const res = await fetch("/api/auth/update-business", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessType })
    })

    if (!res.ok) {
      const data = await res.json()
      alert(`Error: ${data.message || "Something went wrong"}`)
      setLoading(false)
      return
    }

    router.push("/dashboard?first=true")
  } catch (error) {
    console.error("Onboarding error:", error)
    alert("Network error. Check your connection.")
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">
          Welcome to FollowUpPro 👋
        </h1>

        <p className="mb-4 text-gray-600">
          What type of service do you provide?
        </p>

        <select
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          className="w-full p-2 border rounded mb-6"
        >
          <option value="freelancer">Freelancer</option>
          <option value="agency">Agency</option>
          <option value="consultant">Consultant</option>
          <option value="real_estate">Real Estate</option>
          <option value="other">Other</option>
        </select>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  )
}