import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { sendEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")

    if (
      !authHeader ||
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()

    const users = await User.find({
      subscriptionStatus: "trial"
    })

    for (const user of users) {
      if (!user.trialEndsAt) continue

      const daysLeft = Math.ceil(
        (new Date(user.trialEndsAt).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
      )

      // ✅ Send reminder 3 days before expiry
      if (daysLeft === 3) {
        await sendEmail({
          to: user.email,
          subject: "Your trial ends in 3 days",
          html: `
            <p>Hi ${user.name},</p>
            <p>Your FollowUpPro trial ends in 3 days.</p>
            <p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/upgrade">
                Upgrade now to continue unlimited access.
              </a>
            </p>
          `
        })
      }

      // ✅ Send expiration email
      if (daysLeft <= 0 && user.subscriptionStatus === "trial") {
        user.subscriptionStatus = "expired"
        user.plan = "free"
        await user.save()

        await sendEmail({
          to: user.email,
          subject: "Your trial has expired",
          html: `
            <p>Hi ${user.name},</p>
            <p>Your trial has expired.</p>
            <p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/upgrade">
                Upgrade to Pro to continue.
              </a>
            </p>
          `
        })
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Trial reminder error:", error)
    }

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    )
  }
}