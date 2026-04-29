import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const token = req.cookies.get("token")?.value
    if (!token) return NextResponse.json(null)

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    const user = await User.findById(decoded.userId).select("-password")

    if (!user) return NextResponse.json(null)

    return NextResponse.json(user)
  } catch {
    return NextResponse.json(null)
  }
}