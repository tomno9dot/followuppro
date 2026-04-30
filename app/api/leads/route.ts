import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { z } from "zod"
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

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const userId = getUserId(req)

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const leads = await Lead.find({ userId }).sort({
      createdAt: -1
    })

    return NextResponse.json(leads)

  } catch (error) {

    if (process.env.NODE_ENV !== "production") {
      console.error("Fetch leads error:", error)
    }

    return NextResponse.json(
      { message: "Server error fetching leads" },
      { status: 500 }
    )
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

    // ✅ Validate input
    const schema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      serviceOffered: z.string().optional(),
      dealValue: z.number().optional(),
      nextFollowUpAt: z.string().optional()
    })

    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid lead data" },
        { status: 400 }
      )
    }

    const {
      name,
      email,
      serviceOffered,
      dealValue,
      nextFollowUpAt
    } = parsed.data

    const lead = await Lead.create({
      userId,
      name,
      email,
      serviceOffered,
      dealValue: dealValue || 0,
      nextFollowUpAt: nextFollowUpAt
        ? new Date(nextFollowUpAt)
        : null
    })

    return NextResponse.json(lead)

  } catch (error) {

    if (process.env.NODE_ENV !== "production") {
      console.error("Create lead error:", error)
    }

    return NextResponse.json(
      { message: "Server error creating lead" },
      { status: 500 }
    )
  }
}