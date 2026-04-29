"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // ✅ Fetch current user
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        cache: "no-store"
      })
      const data = await res.json()

      if (data) {
        setUser(data)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  // ✅ Logout handler
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })

    // Immediately clear state
    setUser(null)

    // Force navigation refresh
    router.push("/login")
    router.refresh()
  }

  if (loading) return null

  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link href="/" className="text-xl font-bold">
          FollowUpPro
        </Link>

        {!user ? (
          <nav className="space-x-6">
            <Link href="/login" className="text-gray-600 hover:text-black">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg"
            >
              Get Started
            </Link>
          </nav>
        ) : (
          <nav className="flex items-center space-x-6">
            <Link href="/dashboard" className="text-gray-700 hover:text-black">
              Dashboard
            </Link>

            <span className="text-sm text-gray-500 truncate max-w-[160px]">
              {user.email}
            </span>

            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline text-sm"
            >
              Logout
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}