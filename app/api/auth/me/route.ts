import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const token = req.cookies.get("token")?.value
    if (!token) return NextResponse.json(null)

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await User.findById(decoded.userId)

    if (!user) return NextResponse.json(null)

    // ✅ Auto-expire trial
    if (
      user.subscriptionStatus === "trial" &&
      user.trialEndsAt &&
      new Date() > new Date(user.trialEndsAt)
    ) {
      user.subscriptionStatus = "expired"
      user.plan = "free"
      await user.save()
    }

    return NextResponse.json({
      plan: user.plan,
      subscriptionStatus: user.subscriptionStatus,
      trialEndsAt: user.trialEndsAt,
      aiGenerationsThisMonth: user.aiGenerationsThisMonth
    })

  } catch {
    return NextResponse.json(null)
  }
}