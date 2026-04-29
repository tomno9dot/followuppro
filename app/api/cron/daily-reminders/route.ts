import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Lead from "@/models/Lead"
import User from "@/models/User"
import { sendEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  await connectDB()

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const leads = await Lead.find({
    nextFollowUpAt: { $gte: todayStart, $lte: todayEnd },
    status: { $ne: "closed_won" }
  }).populate("userId")

  const grouped: any = {}

  leads.forEach((lead: any) => {
    const userId = lead.userId._id.toString()
    if (!grouped[userId]) grouped[userId] = []
    grouped[userId].push(lead)
  })

  for (const userId in grouped) {
    const user = await User.findById(userId)
    const userLeads = grouped[userId]

    const list = userLeads
      .map((l: any) => `• ${l.name} – ${l.serviceOffered}`)
      .join("<br/>")

    await sendEmail({
      to: user.email,
      subject: `You have ${userLeads.length} follow-ups today`,
      html: `
        <p>Hi ${user.name},</p>
        <p>You have ${userLeads.length} follow-ups scheduled today:</p>
        <p>${list}</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Open Dashboard</a></p>
      `
    })
  }

  return NextResponse.json({ success: true })
}