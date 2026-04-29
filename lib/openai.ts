import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateFollowUp({
  businessType,
  clientName,
  serviceOffered,
  daysSinceLastContact,
  followUpType
}: {
  businessType: string
  clientName: string
  serviceOffered: string
  daysSinceLastContact: number
  followUpType: string
}) {
  const systemPrompt = `
You are a professional sales assistant helping service-based business owners follow up with potential clients.

Rules:
- Keep under 150 words
- Be confident, not desperate
- Sound human and professional
- End with a soft call to action
`

  const userPrompt = `
Business Type: ${businessType}
Client Name: ${clientName}
Service Offered: ${serviceOffered}
Days Since Last Contact: ${daysSinceLastContact}
Follow-Up Type: ${followUpType}

Write:
1. A subject line
2. The email body
`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]
  })

  
  return response.choices[0].message.content ?? ""
}