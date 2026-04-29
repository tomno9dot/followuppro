import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import Lead from "@/models/Lead"
import { connectDB } from "@/lib/db"

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

// GET all leads for user
export async function GET(req: NextRequest) {
  await connectDB()

  const userId = getUserIdFromToken(req)
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  const leads = await Lead.find({ userId })
  return NextResponse.json(leads)
}

// POST create lead
export async function POST(req: NextRequest) {
  await connectDB()

  const userId = getUserIdFromToken(req)
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  const { name, email, serviceOffered, nextFollowUpAt } = await req.json()

  const lead = await Lead.create({
    userId,
    name,
    email,
    serviceOffered,
    nextFollowUpAt: new Date(nextFollowUpAt)
  })

  return NextResponse.json(lead, { status: 201 })
}