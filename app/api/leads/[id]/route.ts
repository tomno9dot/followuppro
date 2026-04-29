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

// GET single lead
export async function GET(req: NextRequest, { params }: any) {
  await connectDB()

  const userId = getUserIdFromToken(req)
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  const lead = await Lead.findOne({ _id: params.id, userId })
  if (!lead) return NextResponse.json({ message: "Not found" }, { status: 404 })

  return NextResponse.json(lead)
}

// PUT update lead
export async function PUT(req: NextRequest, { params }: any) {
  await connectDB()

  const userId = getUserIdFromToken(req)
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  const data = await req.json()

  const lead = await Lead.findOneAndUpdate(
    { _id: params.id, userId },
    data,
    { new: true }
  )

  if (!lead) return NextResponse.json({ message: "Not found" }, { status: 404 })

  return NextResponse.json(lead)
}

// DELETE lead
export async function DELETE(req: NextRequest, { params }: any) {
  await connectDB()

  const userId = getUserIdFromToken(req)
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  const lead = await Lead.findOneAndDelete({ _id: params.id, userId })

  if (!lead) return NextResponse.json({ message: "Not found" }, { status: 404 })

  return NextResponse.json({ message: "Deleted" })
}