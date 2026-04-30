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
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const userId = getUserId(req)

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()

    const lead = await Lead.findOne({
      _id: params.id,
      userId
    })

    if (!lead) {
      return NextResponse.json(
        { message: "Lead not found" },
        { status: 404 }
      )
    }

    // ✅ Update status if provided
    if (body.status) {
      lead.status = body.status
    }

    // ✅ Update deal value if provided
    if (typeof body.dealValue === "number") {
      lead.dealValue = body.dealValue
    }

    // ✅ Optional: enforce deal value when closed
    if (
      body.status === "closed_won" &&
      (!lead.dealValue || lead.dealValue <= 0)
    ) {
      // You can choose default behavior here
      lead.dealValue = 0
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