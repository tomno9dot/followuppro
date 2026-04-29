"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function AppLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setUser(data))
  }, [])

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* ✅ Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-6 font-bold text-xl border-b">
          FollowUpPro
        </div>

        <nav className="flex-1 p-6 space-y-4">
          <Link href="/dashboard" className="block text-gray-700 hover:text-black font-medium">
            Dashboard
          </Link>

          <Link href="/upgrade" className="block text-gray-700 hover:text-black">
            Upgrade
          </Link>
        </nav>

        {user && (
          <div className="p-6 border-t text-sm text-gray-600">
            <p className="truncate">{user.email}</p>

            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" })
                window.location.href = "/"
              }}
              className="mt-3 text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        )}
      </aside>

      {/* ✅ Main Area */}
      <main className="flex-1">

        {/* Top Bar */}
        <div className="bg-white border-b px-8 py-4 flex justify-between items-center">
          <h2 className="font-semibold text-lg">
            Follow-Up Dashboard
          </h2>

          <div className="text-sm text-gray-500">
            Stay consistent. Close more deals.
          </div>
        </div>

        {/* Content */}
        <div className="p-8 bg-gray-100 min-h-screen">
          {children}
        </div>

      </main>

    </div>
  )
}