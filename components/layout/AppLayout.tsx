"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  const navItemClass = (path: string) =>
    `block px-3 py-2 rounded-lg ${
      pathname === path
        ? "bg-blue-100 text-blue-700 font-medium"
        : "text-gray-700 hover:bg-gray-200"
    }`

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* ✅ Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">

        <div className="p-6 text-xl font-bold border-b">
          FollowUpPro
        </div>

        <nav className="flex-1 p-6 space-y-2">

          <Link href="/dashboard" className={navItemClass("/dashboard")}>
            Dashboard
          </Link>

          <Link href="/pipeline" className={navItemClass("/pipeline")}>
            Pipeline
          </Link>

          <Link href="/upgrade" className={navItemClass("/upgrade")}>
            Upgrade
          </Link>

        </nav>

        <div className="p-6 border-t">
          <button
            onClick={handleLogout}
            className="w-full text-left text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>

      </aside>

      {/* ✅ Main Content */}
      <main className="flex-1 flex flex-col">

        {/* Top Bar */}
        <div className="bg-white border-b px-8 py-4">
          <h2 className="font-semibold text-lg">
            {pathname === "/dashboard" && "Dashboard"}
            {pathname === "/pipeline" && "Pipeline"}
            {pathname === "/upgrade" && "Upgrade Plan"}
          </h2>
        </div>

        {/* Content Area */}
        <div className="p-8 flex-1">
          {children}
        </div>

      </main>

    </div>
  )
}