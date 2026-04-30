import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* ✅ HERO */}
      <section className="text-center py-24 px-6 max-w-4xl mx-auto">

        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          Stop Losing $5K+ Clients Due To Delayed Follow‑Ups
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          FollowUpPro helps consultants track at‑risk deals,
          generate professional AI follow‑ups, and recover lost revenue.
        </p>

        <div className="flex justify-center space-x-4">
          <Link
            href="/signup"
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg font-medium"
          >
            Start Free 14‑Day Trial
          </Link>

          <Link
            href="/login"
            className="border border-gray-300 hover:bg-gray-100 transition px-6 py-3 rounded-lg font-medium"
          >
            Login
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Recover one missed $5,000 deal and this pays for itself for years.
        </p>

      </section>

      {/* ✅ PAIN SECTION */}
      <section className="bg-white py-20 px-6">

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 text-center">

          <div>
            <h3 className="font-semibold text-lg mb-3">
              Deals Stuck After Proposal
            </h3>
            <p className="text-gray-600 text-sm">
              Clients go silent and you forget to follow up consistently.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">
              Revenue At Risk
            </h3>
            <p className="text-gray-600 text-sm">
              Thousands in potential revenue sitting in follow-up limbo.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">
              Inconsistent Close Rates
            </h3>
            <p className="text-gray-600 text-sm">
              Most consultants don’t have a skill problem — they have a consistency problem.
            </p>
          </div>

        </div>

      </section>

      {/* ✅ SOLUTION SECTION */}
      <section className="py-20 px-6 text-center">

        <h2 className="text-2xl font-bold mb-6">
          A Simple Revenue Recovery System
        </h2>

        <div className="max-w-3xl mx-auto text-gray-600 space-y-4">
          <p>
            Track your pipeline. Identify revenue at risk.
            Generate AI-powered follow-ups instantly.
          </p>
          <p>
            Monitor close rates. Improve performance.
            Recover deals before they die.
          </p>
        </div>

      </section>

      {/* ✅ SOCIAL PROOF PLACEHOLDER */}
      <section className="bg-gray-100 py-20 px-6 text-center">

        <h2 className="text-xl font-semibold mb-6">
          Built For High‑Value Consultants
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Consultants closing $5K–$20K projects use FollowUpPro
          to stay consistent and increase close rates.
        </p>

      </section>

      {/* ✅ PRICING SECTION */}
      <section className="py-20 px-6 text-center">

        <h2 className="text-2xl font-bold mb-6">
          Consultant Founding Pricing
        </h2>

        <div className="text-4xl font-bold mb-2">
          $29/month
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Increasing to $39 soon.
        </p>

        <Link
          href="/signup"
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-3 rounded-lg font-medium"
        >
          Get Started
        </Link>

      </section>

      {/* ✅ FAQ SECTION */}
      <section className="bg-white py-20 px-6 max-w-4xl mx-auto">

        <h2 className="text-xl font-semibold mb-6 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6 text-gray-600 text-sm">

          <div>
            <p className="font-medium">Is this a full CRM?</p>
            <p>No. It focuses only on follow‑ups and revenue recovery.</p>
          </div>

          <div>
            <p className="font-medium">Does this replace my existing tools?</p>
            <p>No. Many consultants use it alongside their current workflow.</p>
          </div>

          <div>
            <p className="font-medium">What if it doesn’t help?</p>
            <p>You can cancel anytime during trial.</p>
          </div>

        </div>

      </section>

      {/* ✅ FOOTER */}
      <footer className="border-t py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} FollowUpPro. All rights reserved.
      </footer>

    </div>
  )
}