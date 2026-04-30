import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()

    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex")

    const signature = req.headers.get("x-paystack-signature")

    if (!signature || hash !== signature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 }
      )
    }

    const event = JSON.parse(body)

    if (event.event === "charge.success") {

      await connectDB()

      const email = event.data.customer.email

      const user = await User.findOne({ email })

      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        )
      }

      // ✅ Idempotency safety
      if (user.plan === "pro") {
        return NextResponse.json({ received: true })
      }

      user.plan = "pro"
      user.subscriptionStatus = "active"

      await user.save()
    }

    return NextResponse.json({ received: true })

  } catch (error) {

    if (process.env.NODE_ENV !== "production") {
      console.error("Paystack webhook error:", error)
    }

    return NextResponse.json(
      { message: "Server error during webhook handling" },
      { status: 500 }
    )
  }
}