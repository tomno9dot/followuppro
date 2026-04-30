import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"
import Message from "@/models/Message"

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

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ leadId: string }> }
) {
  try {
    await connectDB()

    const { leadId } = await context.params

    const userId = getUserId(req)

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const messages = await Message.find({
      leadId,
      userId
    }).sort({ createdAt: -1 })

    return NextResponse.json(messages)

  } catch (error) {

    if (process.env.NODE_ENV !== "production") {
      console.error("Fetch messages error:", error)
    }

    return NextResponse.json(
      { message: "Server error fetching messages" },
      { status: 500 }
    )
  }
}