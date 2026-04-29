import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function POST(req: NextRequest) {
  const body = await req.text()

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest("hex")

  if (hash !== req.headers.get("x-paystack-signature")) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 })
  }

  const event = JSON.parse(body)

  if (event.event === "charge.success") {
    await connectDB()

    const email = event.data.customer.email

    await User.findOneAndUpdate(
      { email },
      {
        plan: "pro",
        subscriptionStatus: "active"
      }
    )
  }

  return NextResponse.json({ received: true })
}