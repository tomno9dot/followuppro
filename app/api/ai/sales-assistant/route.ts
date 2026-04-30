import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: NextRequest) {
  const { question } = await req.json()

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content: `
You are a SaaS sales assistant for FollowUpPro.
The product helps consultants recover lost revenue through consistent follow-ups.
Answer confidently, focus on revenue benefits, not features.
Keep responses under 120 words.
`
      },
      {
        role: "user",
        content: question
      }
    ]
  })

  return NextResponse.json({
    answer: response.choices[0].message.content
  })
}