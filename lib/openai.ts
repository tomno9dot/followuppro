import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateFollowUpEmail(
  name: string,
  service: string
) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: "You are a professional sales assistant."
        },
        {
          role: "user",
          content: `
Write a professional follow-up email to ${name}.
Service offered: ${service}.
Keep it under 150 words.
Include subject line.
`
        }
      ]
    })

    return response.choices[0].message.content ?? ""

  } catch (error: any) {

    // ✅ Fallback if quota exceeded
    if (error?.code === "insufficient_quota") {
      return `
Subject: Quick Follow-Up

Hi ${name},

Just following up on our previous discussion about ${service}.
Let me know if you have any questions or would like to move forward.

Best regards
`
    }

    throw error
  }
}