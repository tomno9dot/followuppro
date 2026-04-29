import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import Lead from "@/models/Lead"
import Message from "@/models/Message"
import { generateFollowUp } from "@/lib/openai"

function getUserIdFromToken(req: NextRequest) {
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
  await connectDB()

  const userId = getUserIdFromToken(req)
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  const { leadId, followUpType } = await req.json()

  const user = await User.findById(userId)
  const lead = await Lead.findOne({ _id: leadId, userId })

  if (!lead)
    return NextResponse.json({ message: "Lead not found" }, { status: 404 })

  // Plan check
  if (user.plan === "free" && user.aiGenerationsThisMonth >= 5) {
    return NextResponse.json({ message: "AI limit reached" }, { status: 403 })
  }

  const daysSinceLastContact = lead.lastContactedAt
    ? Math.floor(
        (Date.now() - new Date(lead.lastContactedAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 3

  const aiResponse = await generateFollowUp({
    businessType: user.businessType || "service provider",
    clientName: lead.name,
    serviceOffered: lead.serviceOffered,
    daysSinceLastContact,
    followUpType
  })

  const [subjectLine, ...bodyParts] = aiResponse.split("\n")
  const subject = subjectLine.replace("Subject:", "").trim()
  const content = bodyParts.join("\n").trim()

  await Message.create({
    userId,
    leadId,
    subject,
    content
  })

  user.aiGenerationsThisMonth += 1
  await user.save()

  return NextResponse.json({ subject, content })
}