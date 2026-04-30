import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Lead from "@/models/Lead"
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

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    const leads = await Lead.find({
      nextFollowUpAt: { $gte: today, $lt: tomorrow }
    }).populate("userId")

    const grouped: Record<string, any[]> = {}

    leads.forEach((lead: any) => {
      const userId = lead.userId._id.toString()
      if (!grouped[userId]) grouped[userId] = []
      grouped[userId].push(lead)
    })

    for (const userId in grouped) {
      const user = await User.findById(userId)
      if (!user) continue

      const userLeads = grouped[userId]

      const list = userLeads
        .map(l => `• ${l.name} – ${l.serviceOffered || "Service"}`)
        .join("<br/>")

      await sendEmail({
        to: user.email,
        subject: `You have ${userLeads.length} follow-up(s) today`,
        html: `
          <p>Hi ${user.name},</p>
          <p>You have follow-ups scheduled today:</p>
          <p>${list}</p>
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">
              Open Dashboard
            </a>
          </p>
        `
      })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Daily reminder error:", error)
    }

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    )
  }
}