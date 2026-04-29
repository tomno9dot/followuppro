"use client"

export default function UpgradePage() {

  const handleUpgrade = async () => {
    const res = await fetch("/api/paystack/initialize", {
      method: "POST"
    })

    const data = await res.json()

    if (data.authorization_url) {
      window.location.href = data.authorization_url
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow rounded w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Upgrade to Pro</h1>
        <p className="mb-6">
          Unlimited leads, unlimited AI follow-ups, email sending.
        </p>

        <button
          onClick={handleUpgrade}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Upgrade for $19/month
        </button>
      </div>
    </div>
  )
}