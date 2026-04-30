import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { z } from "zod"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import Lead from "@/models/Lead"
import Message from "@/models/Message"
import { generateFollowUpEmail } from "@/lib/openai"
import { aiLimiter } from "@/lib/rateLimiter"

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

    try {
      await aiLimiter.consume(userId)
    } catch {
      return NextResponse.json(
        { message: "Too many requests. Slow down." },
        { status: 429 }
      )
    }

    const schema = z.object({
      leadId: z.string().min(1)
    })

    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input" },
        { status: 400 }
      )
    }

    const { leadId } = parsed.data

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    if (
      user.subscriptionStatus === "trial" &&
      user.trialEndsAt &&
      new Date() > new Date(user.trialEndsAt)
    ) {
      user.subscriptionStatus = "expired"
      user.plan = "free"
      await user.save()
    }

    const currentMonth = new Date().getMonth()

    if (user.lastResetMonth !== currentMonth) {
      user.aiGenerationsThisMonth = 0
      user.lastResetMonth = currentMonth
      await user.save()
    }

    if (user.plan === "free") {
      if (user.aiGenerationsThisMonth >= 5) {
        return NextResponse.json(
          { message: "AI limit reached. Upgrade to Pro." },
          { status: 403 }
        )
      }
    }

    const lead = await Lead.findOne({ _id: leadId, userId })

    if (!lead) {
      return NextResponse.json(
        { message: "Lead not found" },
        { status: 404 }
      )
    }

    const aiText = await generateFollowUpEmail(
      lead.name,
      lead.serviceOffered || "consultation"
    )

    const lines = aiText.split("\n")
    const subject = lines[0].replace("Subject:", "").trim()
    const content = lines.slice(1).join("\n").trim()

    await Message.create({
      userId,
      leadId,
      subject,
      content
    })

    user.aiGenerationsThisMonth += 1
    await user.save()

    return NextResponse.json({ subject, content })

  } catch (error) {

    // ✅ SAFE LOGGING
    if (process.env.NODE_ENV !== "production") {
      console.error("AI generation error:", error)
    }

    return NextResponse.json(
      { message: "Server error during AI generation" },
      { status: 500 }
    )
  }
}