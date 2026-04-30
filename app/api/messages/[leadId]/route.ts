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
  { params }: { params: { leadId: string } }
) {
  await connectDB()

  const userId = getUserId(req)
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  const messages = await Message.find({
    leadId: params.leadId,
    userId
  }).sort({ createdAt: -1 })

  return NextResponse.json(messages)
}