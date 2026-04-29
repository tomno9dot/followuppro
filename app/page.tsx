import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Hero Section */}
      <section className="text-center py-20 px-6 bg-gray-50">
        <h1 className="text-4xl font-bold mb-6">
          Stop Losing Clients Because You Forgot to Follow Up
        </h1>

        <p className="text-lg mb-8 max-w-2xl mx-auto">
          FollowUpPro reminds you exactly when to follow up —
          and writes the message for you.
          Close more deals without stress.
        </p>

        <Link
          href="/signup"
          className="bg-blue-600 text-white px-6 py-3 rounded text-lg hover:bg-blue-700"
        >
          Start Free 14‑Day Trial
        </Link>

        <p className="mt-4 text-sm text-gray-500">
          No credit card required
        </p>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="font-bold text-xl mb-3">1. Add Your Lead</h3>
            <p>
              Enter your client details and set a follow-up date.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-3">2. Get Reminded</h3>
            <p>
              We notify you exactly when it’s time to follow up.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-3">3. Generate & Send</h3>
            <p>
              AI writes a professional follow-up email instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">
          Simple Pricing
        </h2>

        <div className="max-w-xl mx-auto bg-white p-8 rounded shadow text-center">
          <h3 className="text-2xl font-bold mb-4">
            Pro Plan — $19/month
          </h3>

          <ul className="mb-6 space-y-2 text-gray-700">
            <li>✅ Unlimited leads</li>
            <li>✅ Unlimited AI follow-ups</li>
            <li>✅ Email sending</li>
            <li>✅ Reminder system</li>
          </ul>

          <Link
            href="/signup"
            className="bg-blue-600 text-white px-6 py-3 rounded text-lg hover:bg-blue-700"
          >
            Start Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        © {new Date().getFullYear()} FollowUpPro. All rights reserved.
      </footer>

    </div>
  )
}