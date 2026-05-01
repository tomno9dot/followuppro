import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

function getUserId(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    return decoded.userId
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const userId = getUserId(req)
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    const amount = 1900 * 100 // ✅ $19 only

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: user.email,
          amount,
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: "Payment initialization failed" },
        { status: 500 }
      )
    }

    return NextResponse.json(data.data)

  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Paystack initialize error:", error)
    }

    return NextResponse.json(
      { message: "Server error during payment initialization" },
      { status: 500 }
    )
  }
}