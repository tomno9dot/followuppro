import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function POST(req: NextRequest) {
  try {
    // ✅ Connect to Mongo
    await connectDB()

    // ✅ Get token from cookie
    const token = req.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    // ✅ Verify token
    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!)
    } catch (err) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      )
    }

    // ✅ Get business type from request body
    const { businessType } = await req.json()

    if (!businessType) {
      return NextResponse.json(
        { message: "Business type required" },
        { status: 400 }
      )
    }

    // ✅ Update user
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      {
        businessType,
        onboardingCompleted: true
      },
      { new: true }
    )

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "Business type updated successfully"
    })

  } catch (error) {
    console.error("Update-business error:", error)
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    )
  }
}