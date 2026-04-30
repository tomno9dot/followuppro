import Link from "next/link"

export default function ConsultantsPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* ✅ HERO */}
      <section className="text-center py-24 px-6 max-w-4xl mx-auto">

        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          Recover Lost $5K–$20K Consultant Deals
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          FollowUpPro helps consultants track revenue at risk,
          stay consistent with follow‑ups,
          and close more high‑value clients.
        </p>

        <Link
          href="/signup"
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-3 rounded-lg font-medium"
        >
          Start Free Trial
        </Link>

      </section>

      {/* ✅ PROBLEM SECTION */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-6 text-center">

          <h2 className="text-2xl font-bold">
            Most Consultants Don’t Have a Close Rate Problem
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            They have a follow‑up consistency problem.
            High‑value deals don’t die immediately.
            They fade after proposal when follow‑ups slow down.
          </p>

        </div>
      </section>

      {/* ✅ SOLUTION SECTION */}
      <section className="py-20 px-6 text-center">

        <h2 className="text-2xl font-bold mb-6">
          A Simple Revenue Recovery System
        </h2>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10 text-gray-600 text-sm">

          <div>
            <h3 className="font-semibold text-base mb-2">
              Revenue At Risk Tracking
            </h3>
            <p>
              Instantly see how much potential revenue is sitting in follow‑up limbo.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-2">
              AI Follow‑Up Generation
            </h3>
            <p>
              Generate professional follow‑ups instantly without friction.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-2">
              Performance Score
            </h3>
            <p>
              Improve close rate with real conversion metrics.
            </p>
          </div>

        </div>

      </section>

      {/* ✅ ROI SECTION */}
      <section className="bg-gray-100 py-20 px-6 text-center">

        <h2 className="text-2xl font-bold mb-4">
          One Missed Deal Pays for Years
        </h2>

        <p className="text-gray-600 max-w-xl mx-auto">
          If this system helps recover just one $7,000 consulting deal,
          it pays for itself for years.
        </p>

      </section>

      {/* ✅ CTA */}
      <section className="py-20 px-6 text-center">

        <h2 className="text-2xl font-bold mb-6">
          Stop Letting Deals Fade Away
        </h2>

        <Link
          href="/signup"
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-3 rounded-lg font-medium"
        >
          Get Started
        </Link>

      </section>

      {/* ✅ FOOTER */}
      <footer className="border-t py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} FollowUpPro
      </footer>

    </div>
  )
}