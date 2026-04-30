import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { z } from "zod"
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

    const schema = z.object({
      plan: z.enum(["pro", "proplus"])
    })

    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid plan selected" },
        { status: 400 }
      )
    }

    const { plan } = parsed.data

    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    // ✅ Dynamic pricing
    const pricing = {
      pro: 2900,      // $29
      proplus: 3900   // $39
    }

    const amount = pricing[plan] * 100

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
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
          metadata: {
            plan
          }
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