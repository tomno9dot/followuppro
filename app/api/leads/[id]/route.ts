import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"
import Lead from "@/models/Lead"

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

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await context.params

    const userId = getUserId(req)

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()

    const lead = await Lead.findOne({
      _id: id,
      userId
    })

    if (!lead) {
      return NextResponse.json(
        { message: "Lead not found" },
        { status: 404 }
      )
    }

    if (body.status) {
      lead.status = body.status
    }

    if (typeof body.dealValue === "number") {
      lead.dealValue = body.dealValue
    }

    if (body.nextFollowUpAt) {
      lead.nextFollowUpAt = new Date(body.nextFollowUpAt)
    }

    await lead.save()

    return NextResponse.json(lead)

  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Update lead error:", error)
    }

    return NextResponse.json(
      { message: "Server error updating lead" },
      { status: 500 }
    )
  }
}