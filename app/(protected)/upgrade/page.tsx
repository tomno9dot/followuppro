"use client"

import { useState } from "react"
import AppLayout from "@/components/layout/AppLayout"

export default function UpgradePage() {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)

    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST"
      })

      const data = await res.json()

      if (data.authorization_url) {
        window.location.href = data.authorization_url
      } else {
        alert("Payment initialization failed")
      }

    } catch {
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>

      <div className="space-y-8">

        <div>
          <h1 className="text-3xl font-bold mb-2">
            Upgrade to Pro
          </h1>
          <p className="text-gray-600">
            Founding user pricing.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm max-w-md">

          <h2 className="text-lg font-semibold mb-2">
            Pro — $19/month
          </h2>

          <ul className="text-sm text-gray-600 space-y-2 mb-6">
            <li>✅ Unlimited AI follow‑ups</li>
            <li>✅ Unlimited leads</li>
            <li>✅ Pipeline tracking</li>
            <li>✅ Revenue dashboard</li>
          </ul>

          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full"
          >
            {loading ? "Processing..." : "Upgrade Now"}
          </button>

        </div>

      </div>

    </AppLayout>
  )
}