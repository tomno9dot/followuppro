import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function POST(req: NextRequest) {
  await connectDB()

  const token = req.cookies.get("token")?.value
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
  const user = await User.findById(decoded.userId)

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: user.email,
      amount: 1900 * 100, // $19 in cents
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    })
  })

  const data = await response.json()

  return NextResponse.json(data.data)
}