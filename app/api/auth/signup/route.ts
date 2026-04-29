import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "@/models/User"
import { connectDB } from "@/lib/db"

export async function POST(req: Request) {
  await connectDB()

  const { name, email, password } = await req.json()

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return NextResponse.json({ message: "User already exists" }, { status: 400 })
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
  
  const response = NextResponse.json({ redirect: "/onboarding" })

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/"
  })

  return response
}