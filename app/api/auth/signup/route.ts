import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { z } from "zod"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const schema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6)
    })

    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input data" },
        { status: 400 }
      )
    }

    const { name, email, password } = parsed.data

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      plan: "free",
      subscriptionStatus: "trial",
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      aiGenerationsThisMonth: 0,
      lastResetMonth: new Date().getMonth()
    })

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    )

    const response = NextResponse.json({
      message: "Signup successful"
    })

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/"
    })

    return response

  } catch (error) {

    // ✅ SAFE LOGGING
    if (process.env.NODE_ENV !== "production") {
      console.error("Signup error:", error)
    }

    return NextResponse.json(
      { message: "Server error during signup" },
      { status: 500 }
    )
  }
}