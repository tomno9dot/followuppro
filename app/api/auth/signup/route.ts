import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      )
    }

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
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    })

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    )

    const response = NextResponse.json({ message: "User created" })

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/"
    })

    return response

  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    )
  }
}