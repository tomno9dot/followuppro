import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function POST(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  await connectDB()

  const now = new Date()

  await User.updateMany(
    {
      subscriptionStatus: "trial",
      trialEndsAt: { $lte: now }
    },
    {
      plan: "free",
      subscriptionStatus: "expired"
    }
  )

  return NextResponse.json({ success: true })
}