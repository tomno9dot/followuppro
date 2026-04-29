"use client"

import { useState } from "react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // For now just simulate
    setMessage("If this email exists, a reset link will be sent.")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow border w-full max-w-md">
        <h1 className="text-xl font-bold mb-6">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
            Send Reset Link
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-gray-600">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}