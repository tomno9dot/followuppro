"use client"

import { useState } from "react"
import AppLayout from "@/components/layout/AppLayout"

export default function UpgradePage() {
  const [selectedPlan, setSelectedPlan] = useState("pro")
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)

    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan })
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
            Upgrade Your Revenue System
          </h1>
          <p className="text-gray-600">
            Unlock advanced analytics and unlimited AI follow-ups.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* ✅ Pro Plan */}
          <div
            className={`bg-white p-6 rounded-xl border shadow-sm ${
              selectedPlan === "pro" ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Pro
              </h2>
              <span className="font-bold">$29/month</span>
            </div>

            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li>✅ Unlimited AI follow-ups</li>
              <li>✅ Unlimited leads</li>
              <li>✅ Pipeline board</li>
              <li>✅ Revenue analytics</li>
              <li>✅ Follow-up reminders</li>
            </ul>

            <button
              onClick={() => setSelectedPlan("pro")}
              className={`w-full py-2 rounded-lg ${
                selectedPlan === "pro"
                  ? "bg-blue-600 text-white"
                  : "border border-blue-600 text-blue-600 hover:bg-blue-50"
              }`}
            >
              {selectedPlan === "pro" ? "Selected" : "Choose Pro"}
            </button>
          </div>

          {/* ✅ Pro+ Plan */}
          <div
            className={`bg-white p-6 rounded-xl border shadow-sm ${
              selectedPlan === "proplus" ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Pro+
              </h2>
              <span className="font-bold">$39/month</span>
            </div>

            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li>✅ Everything in Pro</li>
              <li>✅ Performance scoring</li>
              <li>✅ Monthly revenue reports</li>
              <li>✅ Priority AI model</li>
              <li>✅ Advanced analytics</li>
            </ul>

            <button
              onClick={() => setSelectedPlan("proplus")}
              className={`w-full py-2 rounded-lg ${
                selectedPlan === "proplus"
                  ? "bg-blue-600 text-white"
                  : "border border-blue-600 text-blue-600 hover:bg-blue-50"
              }`}
            >
              {selectedPlan === "proplus" ? "Selected" : "Choose Pro+"}
            </button>
          </div>

        </div>

        <div>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg w-full font-medium disabled:opacity-50"
          >
            {loading ? "Processing..." : "Upgrade Now"}
          </button>
        </div>

      </div>

    </AppLayout>
  )
}