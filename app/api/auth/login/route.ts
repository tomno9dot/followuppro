import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { z } from "zod"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    // ✅ Validate input
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6)
    })

    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid email or password format" },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data

    // ✅ Case-insensitive email
    const user = await User.findOne({
      email: email.toLowerCase()
    })

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      )
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      )
    }

    // ✅ Create JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    )

    const response = NextResponse.json({
      message: "Login successful"
    })

    // ✅ Secure production cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/"
    })

    return response

  } catch (error) {

    if (process.env.NODE_ENV !== "production") {
      console.error("Login error:", error)
    }

    return NextResponse.json(
      { message: "Server error during login" },
      { status: 500 }
    )
  }
}