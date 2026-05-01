import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* ✅ Hero */}
      <section className="text-center py-24 px-6 max-w-4xl mx-auto">

        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          Stay Consistent With Client Follow‑Ups
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          FollowUpPro helps you track leads, generate AI follow‑ups,
          and avoid losing deals due to delayed responses.
        </p>

        <div className="flex justify-center space-x-4">
          <Link
            href="/signup"
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg font-medium"
          >
            Start Free Trial
          </Link>

          <Link
            href="/login"
            className="border border-gray-300 hover:bg-gray-100 transition px-6 py-3 rounded-lg font-medium"
          >
            Login
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          $19/month — Early founding rate
        </p>

      </section>

      {/* ✅ Simple Value Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 text-center">

          <div>
            <h3 className="font-semibold text-lg mb-3">
              Track Leads
            </h3>
            <p className="text-gray-600 text-sm">
              Organize your pipeline clearly.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">
              AI Follow‑Ups
            </h3>
            <p className="text-gray-600 text-sm">
              Generate professional follow‑ups instantly.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">
              Stay Consistent
            </h3>
            <p className="text-gray-600 text-sm">
              Reduce lost deals caused by delayed responses.
            </p>
          </div>

        </div>
      </section>

      {/* ✅ Footer */}
      <footer className="border-t py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} FollowUpPro
      </footer>

    </div>
  )
}