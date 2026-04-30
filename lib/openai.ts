import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateFollowUpEmail(
  name: string,
  service: string
) {
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
}